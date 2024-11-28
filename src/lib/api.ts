import type { FreightNumber, Shipment, DashboardData, Client } from '../types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = new Error('API request failed');
    try {
      const data = await response.json();
      error.message = data.error || 'An error occurred';
    } catch {
      error.message = response.statusText;
    }
    throw error;
  }
  return response.json();
}

export async function getFreightNumbers(): Promise<FreightNumber[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/freight-numbers`);
    return handleResponse<FreightNumber[]>(response);
  } catch (error) {
    console.error('Error fetching freight numbers:', error);
    throw error;
  }
}

export async function createFreightNumber(data: {
  mode: string;
  origin: string;
  destination: string;
  number: string;
}): Promise<FreightNumber> {
  try {
    const response = await fetch(`${API_BASE_URL}/freight-numbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<FreightNumber>(response);
  } catch (error) {
    console.error('Error creating freight number:', error);
    throw error;
  }
}

export async function updateFreightStatus(id: string, status: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/freight-numbers/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    await handleResponse<{ success: true }>(response);
  } catch (error) {
    console.error('Error updating freight status:', error);
    throw error;
  }
}

export async function createClient(data: any): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`);
    return handleResponse<Client[]>(response);
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse<DashboardData>(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function getShipments(): Promise<Shipment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments`);
    return handleResponse<Shipment[]>(response);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    throw error;
  }
}