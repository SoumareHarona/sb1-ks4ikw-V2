import { useState, useEffect } from 'react';
import { Users, Search, Phone, Package2, Calendar, MapPin, ChevronDown, ChevronRight, Truck, Plane, Ship, User, FileText, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Shipment } from '../types';
import { getShipments } from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import { calculatePrice } from '../lib/pricing';
import { PaymentStatus } from './PaymentStatus';
import { DocumentViewer } from './documents/DocumentViewer';
import { BatchProcessor } from './documents/BatchProcessor';
import { toast } from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  phone: string;
  role: 'sender' | 'recipient';
  shipments: Shipment[];
  totalDueEUR: number;
  totalDueXOF: number;
  totalPaidShipments: number;
}

const TransportIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case 'air':
      return <Plane className="h-5 w-5 text-blue-500" />;
    case 'sea':
      return <Ship className="h-5 w-5 text-blue-500" />;
    case 'gp':
      return <Truck className="h-5 w-5 text-blue-500" />;
    default:
      return <Package2 className="h-5 w-5 text-blue-500" />;
  }
};

export function ClientList() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedShipments, setExpandedShipments] = useState<Set<string>>(new Set());
  const [expandedSenders, setExpandedSenders] = useState<Set<string>>(new Set());
  const [showDocumentViewer, setShowDocumentViewer] = useState<{
    type: 'label' | 'invoice';
    shipment: Shipment;
  } | null>(null);
  const [showBatchProcessor, setShowBatchProcessor] = useState<{
    type: 'label' | 'invoice';
    shipments: Shipment[];
  } | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const shipments = await getShipments();
        
        const clientMap = new Map<string, Client>();

        shipments.forEach(shipment => {
          // Process recipient
          const recipientKey = `${shipment.recipient.phone}-recipient`;
          if (!clientMap.has(recipientKey)) {
            clientMap.set(recipientKey, {
              id: recipientKey,
              name: shipment.recipient.name,
              phone: shipment.recipient.phone,
              role: 'recipient',
              shipments: [],
              totalDueEUR: 0,
              totalDueXOF: 0,
              totalPaidShipments: 0
            });
          }
          
          const client = clientMap.get(recipientKey)!;
          client.shipments.push(shipment);

          // Use the payment data from the shipment
          if (shipment.payment) {
            if (shipment.payment.remainingAmount <= 0) {
              client.totalPaidShipments++;
            } else {
              client.totalDueEUR += shipment.payment.remainingAmount;
              client.totalDueXOF += shipment.payment.remainingAmountXOF;
            }
          }
        });

        setClients(Array.from(clientMap.values()));
      } catch (error) {
        console.error('Error loading clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Rest of the component remains the same...
  // (Previous implementation of filteredClients, toggleShipmentDetails, etc.)
}