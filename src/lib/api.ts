import type { FreightNumber, Shipment, DashboardData, Client } from '../types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    console.error('API error:', {
      status: response.status,
      statusText: response.statusText
    });
    const error = new Error('API request failed');
    try {
      const data = await response.json();
      error.message = data.error || 'An error occurred';
      console.error('API error details:', data);
    } catch {
      error.message = response.statusText;
      console.error('Failed to parse error response');
    }
    throw error;
  }
  const data = await response.json();
  console.log('API response:', data);
  return data;
}

export async function getFreightNumbers(): Promise<FreightNumber[]> {
  try {
    console.log('Fetching freight numbers...');
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
    console.log('Creating freight number with data:', data);
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
    console.log('Updating freight status:', { id, status });
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

export async function createClient(data: {
  name: string;
  phone: string;
  location?: string;
}): Promise<Client> {
  try {
    console.log('Creating client with data:', data);
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('Create client response status:', response.status);
    const result = await handleResponse<Client>(response);
    console.log('Create client response:', result);
    return result;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    console.log('Fetching clients...');
    const response = await fetch(`${API_BASE_URL}/clients`);
    console.log('Get clients response status:', response.status);
    const result = await handleResponse<Client[]>(response);
    console.log('Get clients response:', result);
    return result;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function createShipment(data: {
  freightNumberId: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  recipientStreet?: string;
  recipientCity?: string;
  recipientLandmark?: string;
  recipientNotes?: string;
  foodWeight?: number;
  nonFoodWeight?: number;
  hn7Weight?: number;
  length?: number;
  width?: number;
  height?: number;
  packageType?: string;
  packaging: string;
  specialHandling?: string[];
  comments?: string;
  additionalFeesAmount?: number;
  additionalFeesCurrency?: 'EUR' | 'XOF';
  advanceAmount?: number;
  advanceCurrency?: 'EUR' | 'XOF';
}): Promise<Shipment> {
  try {
    console.log('Creating shipment with data:', data);
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Shipment>(response);
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    console.log('Fetching dashboard data...');
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse<DashboardData>(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function getShipments(): Promise<Shipment[]> {
  try {
    console.log('Fetching shipments...');
    const response = await fetch(`${API_BASE_URL}/shipments`);
    return handleResponse<Shipment[]>(response);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    throw error;
  }
}
