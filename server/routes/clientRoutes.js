import express from 'express';
import { asyncAll, asyncGet, asyncRun } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all clients with shipment counts
router.get('/', async (req, res) => {
  try {
    const clients = await asyncAll(`
      WITH shipment_counts AS (
        SELECT 
          client_id,
          COUNT(*) as total_shipments
        FROM (
          SELECT sender_id as client_id FROM shipments
          UNION ALL
          SELECT recipient_id FROM shipments
        )
        GROUP BY client_id
      )
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.location,
        c.created_at as createdAt,
        COALESCE(sc.total_shipments, 0) as totalShipments
      FROM clients c
      LEFT JOIN shipment_counts sc ON c.id = sc.client_id
      ORDER BY c.created_at DESC
    `);

    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      error: 'Failed to retrieve clients',
      details: error.message
    });
  }
});

// Get client by ID with their shipments
router.get('/:id', async (req, res) => {
  try {
    const client = await asyncGet(`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.location,
        c.created_at as createdAt
      FROM clients c
      WHERE c.id = ?
    `, [req.params.id]);

    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    const shipments = await asyncAll(`
      SELECT s.* 
      FROM shipments s
      WHERE s.sender_id = ? OR s.recipient_id = ?
      ORDER BY s.created_at DESC
    `, [req.params.id, req.params.id]);

    client.shipments = shipments;
    client.totalShipments = shipments.length;

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      error: 'Failed to retrieve client',
      details: error.message
    });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name and phone are required'
      });
    }

    const id = uuidv4();
    
    await asyncRun(`
      INSERT INTO clients (id, name, phone, location, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `, [id, name.trim(), phone.trim(), location?.trim() || null]);

    const client = await asyncGet(`
      SELECT 
        c.*,
        0 as totalShipments
      FROM clients c 
      WHERE c.id = ?
    `, [id]);
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      error: 'Failed to create client',
      details: error.message
    });
  }
});

export default router;