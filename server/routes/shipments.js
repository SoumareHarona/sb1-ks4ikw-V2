import express from 'express';
import { asyncAll, asyncGet } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shipments = await asyncAll(`
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
    `);

    const mappedShipments = shipments.map(shipment => ({
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
      qrCode: shipment.qr_code,
      createdAt: shipment.created_at
    }));

    res.json(mappedShipments);
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve shipments',
      details: err.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shipment = await asyncGet(`
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
      WHERE s.id = ?
    `, [req.params.id]);

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({
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
      qrCode: shipment.qr_code,
      createdAt: shipment.created_at
    });
  } catch (err) {
    console.error('Error fetching shipment:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve shipment',
      details: err.message 
    });
  }
});

export default router;