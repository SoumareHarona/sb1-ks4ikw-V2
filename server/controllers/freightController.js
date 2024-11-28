import { v4 as uuidv4 } from 'uuid';
import { asyncGet, asyncRun } from '../db.js';
import { formatFreightNumber } from '../utils/tracking.js';

export async function createFreightNumber(db, data) {
  const { number, mode, origin, destination } = data;

  // Validate required fields
  if (!number || !mode || !origin || !destination) {
    throw new Error('Missing required fields');
  }

  // Validate number format (must be digits only)
  if (!/^\d+$/.test(number)) {
    throw new Error('Freight number must contain only digits');
  }

  // Format the freight number
  const formattedNumber = formatFreightNumber(origin, number);

  try {
    // Check if freight number already exists
    const existing = await asyncGet(
      'SELECT id FROM freight_numbers WHERE number = ?',
      [formattedNumber]
    );

    if (existing) {
      throw new Error('This freight number already exists');
    }

    const id = uuidv4();

    await asyncRun(`
      INSERT INTO freight_numbers (id, number, mode, origin, destination, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))
    `, [id, formattedNumber, mode, origin, destination]);

    return {
      id,
      number: formattedNumber,
      mode,
      origin,
      destination,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to create freight number');
  }
}

export async function updateFreightNumber(db, id, data) {
  const freight = await asyncGet('SELECT id FROM freight_numbers WHERE id = ?', [id]);
  if (!freight) {
    throw new Error('Freight number not found');
  }

  const updateFields = [];
  const values = [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'number') {
      updateFields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (updateFields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(id);

  try {
    await asyncRun(
      `UPDATE freight_numbers SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return await asyncGet('SELECT * FROM freight_numbers WHERE id = ?', [id]);
  } catch (error) {
    throw new Error(`Failed to update freight number: ${error.message}`);
  }
}

export async function deleteFreightNumber(db, id) {
  // Check if freight number exists
  const freight = await asyncGet('SELECT id FROM freight_numbers WHERE id = ?', [id]);
  if (!freight) {
    throw new Error('Freight number not found');
  }

  // Check if freight number has associated clients
  const hasClients = await asyncGet(
    'SELECT COUNT(*) as count FROM clients WHERE freight_number_id = ?',
    [id]
  );

  if (hasClients.count > 0) {
    throw new Error('Cannot delete freight number with associated shipments');
  }

  try {
    await asyncRun('DELETE FROM freight_numbers WHERE id = ?', [id]);
  } catch (error) {
    throw new Error(`Failed to delete freight number: ${error.message}`);
  }
}