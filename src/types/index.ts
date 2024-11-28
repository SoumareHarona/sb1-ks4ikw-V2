export type Language = 'en' | 'fr';
export type FreightMode = 'air' | 'sea' | 'gp';
export type Country = 'Senegal' | 'Mali' | 'Gambia' | 'France';
export type Currency = 'EUR' | 'XOF';
export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface FreightNumber {
  id: string;
  number: string;
  mode: FreightMode;
  origin: Country;
  destination: Country;
  status: ShipmentStatus;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  location?: string;
  totalShipments: number;
  createdAt: string;
  shipments?: Shipment[];
}

export interface PackageDetails {
  description: string;
  quantity: number;
}

export interface Payment {
  baseAmount: number;
  baseAmountXOF: number;
  advanceAmount: number;
  advanceAmountXOF: number;
  remainingAmount: number;
  remainingAmountXOF: number;
  paymentStatus: 'pending' | 'completed';
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  freightNumber: string;
  mode: FreightMode;
  origin: Country;
  destination: Country;
  status: ShipmentStatus;
  sender: {
    name: string;
    phone: string;
  };
  recipient: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      landmark?: string;
    };
  };
  weights?: {
    food?: number;
    nonFood?: number;
    hn7?: number;
    total?: number;
  };
  volume?: {
    length?: number;
    width?: number;
    height?: number;
  };
  packaging?: string;
  payment?: Payment;
  qrCode?: string;
  createdAt: string;
}

export interface MonthlyStat {
  date: string;
  airFreight: number;
  seaFreight: number;
  totalShipments: number;
  revenue: {
    EUR: number;
    XOF: number;
  };
}

export interface DashboardData {
  activeShipments: number;
  airFreight: number;
  seaFreight: number;
  totalClients: number;
  recentShipments: Shipment[];
  monthlyStats: MonthlyStat[];
}