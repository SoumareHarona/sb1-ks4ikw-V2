import express from 'express';
import { asyncAll, asyncGet, asyncRun } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all clients (with detailed logging)
router.get('/', async (req, res) => {
  console.log('GET /api/clients - Starting request');
  try {
    console.log('Executing clients query...');
    const clients = await asyncAll(`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.location,
        c.created_at as createdAt,
        COUNT(DISTINCT s.id) as totalShipments
      FROM clients c
      LEFT JOIN shipments s ON c.id = s.sender_id OR c.id = s.recipient_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    console.log('Clients query successful, found:', clients.length, 'clients');

    res.json(clients);
  } catch (error) {
    console.error('Error in GET /api/clients:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({
      error: 'Failed to retrieve clients',
      details: error.message
    });
  }
});

// Get client by ID (with detailed logging)
router.get('/:id', async (req, res) => {
  console.log('GET /api/clients/:id - Starting request for id:', req.params.id);
  try {
    console.log('Executing client query...');
    const client = await asyncGet(`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.location,
        c.created_at as createdAt,
        COUNT(DISTINCT s.id) as totalShipments
      FROM clients c
      LEFT JOIN shipments s ON c.id = s.sender_id OR c.id = s.recipient_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [req.params.id]);

    if (!client) {
      console.log('Client not found with id:', req.params.id);
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    console.log('Client found:', client);

    // Get client's shipments
    const shipments = await asyncAll(`
      SELECT s.*, f.mode, f.origin, f.destination, f.status
      FROM shipments s
      JOIN freight_numbers f ON s.freight_number_id = f.id
      WHERE s.sender_id = ? OR s.recipient_id = ?
      ORDER BY s.created_at DESC
    `, [req.params.id, req.params.id]);

    client.shipments = shipments;

    console.log('Sending response with client');
    res.json(client);
  } catch (error) {
    console.error('Error in GET /api/clients/:id:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({
      error: 'Failed to retrieve client',
      details: error.message
    });
  }
});

// Create new client (with detailed logging)
router.post('/', async (req, res) => {
  console.log('POST /api/clients - Starting request with body:', req.body);
  try {
    const { name, phone, location } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name and phone are required'
      });
    }

    const id = uuidv4();
    console.log('Generated new client ID:', id);
    
    console.log('Executing insert query...');
    await asyncRun(`
      INSERT INTO clients (id, name, phone, location, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `, [id, name.trim(), phone.trim(), location?.trim() || null]);
    console.log('Insert successful');

    console.log('Fetching created client...');
    const client = await asyncGet(`
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.location,
        c.created_at as createdAt,
        0 as totalShipments
      FROM clients c
      WHERE c.id = ?
    `, [id]);
    
    client.shipments = [];
    
    console.log('Sending response with created client');
    res.status(201).json(client);
  } catch (error) {
    console.error('Error in POST /api/clients:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    res.status(500).json({
      error: 'Failed to create client',
      details: error.message
    });
  }
});

export default router;
