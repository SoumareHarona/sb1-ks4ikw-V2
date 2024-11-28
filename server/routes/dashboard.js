import express from 'express';
import { asyncAll, asyncGet } from '../db.js';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [stats, recentShipments, monthlyStats] = await Promise.all([
      asyncGet(`
        SELECT 
          COUNT(DISTINCT s.id) as total,
          COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.id END) as pending,
          COUNT(DISTINCT CASE WHEN s.status = 'in_transit' THEN s.id END) as in_transit,
          COUNT(DISTINCT CASE WHEN s.status = 'delivered' THEN s.id END) as delivered,
          COUNT(DISTINCT CASE WHEN f.mode = 'air' THEN s.id END) as airFreight,
          COUNT(DISTINCT CASE WHEN f.mode = 'sea' THEN s.id END) as seaFreight,
          COUNT(DISTINCT c.id) as totalClients
        FROM shipments s
        JOIN freight_numbers f ON s.freight_number_id = f.id
        LEFT JOIN clients c ON s.sender_id = c.id OR s.recipient_id = c.id
      `),
      asyncAll(`
        SELECT 
          s.*,
          f.number as freight_number,
          f.mode,
          f.origin,
          f.destination,
          f.status,
          sender.name as sender_name,
          sender.phone as sender_phone,
          recipient.name as recipient_name,
          recipient.phone as recipient_phone
        FROM shipments s
        JOIN freight_numbers f ON s.freight_number_id = f.id
        JOIN clients sender ON s.sender_id = sender.id
        JOIN clients recipient ON s.recipient_id = recipient.id
        ORDER BY s.created_at DESC
        LIMIT 5
      `),
      getMonthlyStats()
    ]);

    // Map shipments to the expected format
    const mappedShipments = (recentShipments || []).map(shipment => ({
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
    }));

    res.json({
      activeShipments: stats?.total || 0,
      airFreight: stats?.airFreight || 0,
      seaFreight: stats?.seaFreight || 0,
      totalClients: stats?.totalClients || 0,
      recentShipments: mappedShipments,
      monthlyStats: monthlyStats || []
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve dashboard data',
      details: err.message 
    });
  }
});

async function getMonthlyStats() {
  const months = 6;
  const stats = [];

  for (let i = 0; i < months; i++) {
    const date = subMonths(new Date(), i);
    const start = format(startOfMonth(date), 'yyyy-MM-dd');
    const end = format(endOfMonth(date), 'yyyy-MM-dd');

    const monthStats = await asyncGet(`
      SELECT 
        COUNT(DISTINCT CASE WHEN f.mode = 'air' THEN s.id END) as airFreight,
        COUNT(DISTINCT CASE WHEN f.mode = 'sea' THEN s.id END) as seaFreight,
        COUNT(DISTINCT s.id) as totalShipments,
        COUNT(DISTINCT c.id) as totalClients
      FROM shipments s
      JOIN freight_numbers f ON s.freight_number_id = f.id
      LEFT JOIN clients c ON s.sender_id = c.id OR s.recipient_id = c.id
      WHERE s.created_at BETWEEN ? AND ?
    `, [start, end]);

    stats.push({
      date: start,
      airFreight: monthStats?.airFreight || 0,
      seaFreight: monthStats?.seaFreight || 0,
      totalShipments: monthStats?.totalShipments || 0,
      revenue: {
        EUR: 0, // We'll implement revenue calculation later
        XOF: 0
      }
    });
  }

  return stats.reverse();
}

export default router;