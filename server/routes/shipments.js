import express from 'express';
import { asyncAll, asyncGet, asyncRun } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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

router.post('/', async (req, res) => {
  console.log('Creating new shipment:', req.body);
  try {
    const {
      freightNumberId,
      senderName,
      senderPhone,
      recipientName,
      recipientPhone,
      recipientEmail,
      recipientStreet,
      recipientCity,
      recipientLandmark,
      recipientNotes,
      foodWeight,
      nonFoodWeight,
      hn7Weight,
      length,
      width,
      height,
      packageType,
      packaging,
      specialHandling,
      comments,
      additionalFeesAmount,
      additionalFeesCurrency,
      advanceAmount,
      advanceCurrency
    } = req.body;

    // Validate required fields
    const requiredFields = {
      freightNumberId: 'Freight number',
      senderName: 'Sender name',
      senderPhone: 'Sender phone',
      recipientName: 'Recipient name',
      recipientPhone: 'Recipient phone',
      packaging: 'Packaging information'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]?.toString().trim()) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: `The following fields are required: ${missingFields.join(', ')}`
      });
    }

    // Verify freight number exists
    const freightNumber = await asyncGet('SELECT id FROM freight_numbers WHERE id = ?', [freightNumberId]);
    if (!freightNumber) {
      return res.status(400).json({
        error: 'Invalid freight number',
        details: 'The specified freight number does not exist'
      });
    }

    // Start transaction
    await asyncRun('BEGIN TRANSACTION');

    try {
      // Create or get sender
      const senderId = uuidv4();
      await asyncRun(
        'INSERT INTO clients (id, name, phone) VALUES (?, ?, ?)',
        [senderId, senderName.trim(), senderPhone.trim()]
      );

      // Create or get recipient
      const recipientId = uuidv4();
      await asyncRun(
        'INSERT INTO clients (id, name, phone) VALUES (?, ?, ?)',
        [recipientId, recipientName.trim(), recipientPhone.trim()]
      );

      // Generate tracking number
      const trackingNumber = `TRK${Date.now().toString(36).toUpperCase()}`;

      // Generate QR code
      const qrCode = await QRCode.toDataURL(trackingNumber);

      // Create shipment
      const shipmentId = uuidv4();
      await asyncRun(`
        INSERT INTO shipments (
          id, tracking_number, freight_number_id, sender_id, recipient_id,
          recipient_email, recipient_street, recipient_city, recipient_landmark,
          recipient_notes, food_weight, non_food_weight, hn7_weight,
          length, width, height, package_type, packaging,
          special_handling, comments, additional_fees_amount,
          additional_fees_currency, advance_amount, advance_currency,
          qr_code, created_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending')
      `, [
        shipmentId, trackingNumber, freightNumberId, senderId, recipientId,
        recipientEmail?.trim(), recipientStreet?.trim(), recipientCity?.trim(), recipientLandmark?.trim(),
        recipientNotes?.trim(), foodWeight, nonFoodWeight, hn7Weight,
        length, width, height, packageType?.trim(), packaging.trim(),
        specialHandling?.join(','), comments?.trim(), additionalFeesAmount,
        additionalFeesCurrency, advanceAmount, advanceCurrency,
        qrCode
      ]);

      // Commit transaction
      await asyncRun('COMMIT');

      // Get created shipment
      const shipment = await asyncGet(`
        SELECT 
          s.*,
          f.number as freight_number,
          f.mode,
          f.origin,
          f.destination,
          f.status as freight_status,
          sender.name as sender_name,
          sender.phone as sender_phone,
          recipient.name as recipient_name,
          recipient.phone as recipient_phone
        FROM shipments s
        JOIN freight_numbers f ON s.freight_number_id = f.id
        JOIN clients sender ON s.sender_id = sender.id
        JOIN clients recipient ON s.recipient_id = recipient.id
        WHERE s.id = ?
      `, [shipmentId]);

      res.status(201).json({
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
    } catch (error) {
      // Rollback transaction on error
      await asyncRun('ROLLBACK');
      throw error;
    }
  } catch (err) {
    console.error('Error creating shipment:', err);
    res.status(500).json({
      error: 'Failed to create shipment',
      details: err.message
    });
  }
});

export default router;
