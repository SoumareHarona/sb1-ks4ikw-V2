import express from 'express';
import { asyncAll, asyncGet } from '../db.js';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('Dashboard route accessed');
  try {
    // Get basic counts
    const stats = await asyncGet(`
      SELECT 
        COUNT(DISTINCT s.id) as total_shipments,
        SUM(CASE WHEN f.mode = 'air' THEN 1 ELSE 0 END) as air_freight,
        SUM(CASE WHEN f.mode = 'sea' THEN 1 ELSE 0 END) as sea_freight,
        COUNT(DISTINCT c.id) as total_clients
      FROM shipments s
      LEFT JOIN freight_numbers f ON s.freight_number_id = f.id
      LEFT JOIN (
        SELECT id FROM clients 
        GROUP BY id
      ) c ON (s.sender_id = c.id OR s.recipient_id = c.id)
    `);

    console.log('Stats query result:', stats);

    // Get recent shipments
    const recentShipments = await asyncAll(`
      SELECT 
        s.id,
        s.tracking_number,
        f.number as freight_number,
        f.mode,
        f.origin,
        f.destination,
        f.status,
        sender.name as sender_name,
        sender.phone as sender_phone,
        recipient.name as recipient_name,
        recipient.phone as recipient_phone,
        s.created_at
      FROM shipments s
      LEFT JOIN freight_numbers f ON s.freight_number_id = f.id
      LEFT JOIN clients sender ON s.sender_id = sender.id
      LEFT JOIN clients recipient ON s.recipient_id = recipient.id
      ORDER BY s.created_at DESC
      LIMIT 5
    `);

    console.log('Recent shipments query result:', recentShipments);

    // Get current month stats
    const currentDate = new Date();
    const startOfCurrentMonth = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const endOfCurrentMonth = format(endOfMonth(currentDate), 'yyyy-MM-dd');

    const currentMonthStats = await asyncGet(`
      SELECT 
        COUNT(DISTINCT s.id) as total,
        SUM(CASE WHEN f.mode = 'air' THEN 1 ELSE 0 END) as air_freight,
        SUM(CASE WHEN f.mode = 'sea' THEN 1 ELSE 0 END) as sea_freight
      FROM shipments s
      LEFT JOIN freight_numbers f ON s.freight_number_id = f.id
      WHERE date(s.created_at) BETWEEN date(?) AND date(?)
    `, [startOfCurrentMonth, endOfCurrentMonth]);

    console.log('Current month stats:', currentMonthStats);

    // Format the response
    const response = {
      activeShipments: stats?.total_shipments || 0,
      airFreight: stats?.air_freight || 0,
      seaFreight: stats?.sea_freight || 0,
      totalClients: stats?.total_clients || 0,
      recentShipments: recentShipments.map(shipment => ({
        id: shipment.id,
        trackingNumber: shipment.tracking_number,
        freightNumber: shipment.freight_number,
        mode: shipment.mode,
        origin: shipment.origin,
        destination: shipment.destination,
        status: shipment.status,
        sender: {
          name: shipment.sender_name,
          phone: shipment.sender_phone
        },
        recipient: {
          name: shipment.recipient_name,
          phone: shipment.recipient_phone
        },
        createdAt: shipment.created_at
      })),
      monthlyStats: [{
        date: startOfCurrentMonth,
        airFreight: currentMonthStats?.air_freight || 0,
        seaFreight: currentMonthStats?.sea_freight || 0,
        totalShipments: currentMonthStats?.total || 0,
        revenue: { EUR: 0, XOF: 0 }
      }]
    };

    console.log('Sending dashboard response:', response);
    res.json(response);
  } catch (err) {
    console.error('Dashboard error:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      errno: err.errno
    });
    
    res.status(500).json({ 
      error: 'Failed to retrieve dashboard data',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;
