import { useState, useEffect } from 'react';
import { Ship, Plane, Package2, Search, User, Box, MapPin, Calendar, CreditCard, ChevronDown, ChevronRight, CheckCircle, Clock, FileText, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Shipment } from '../types';
import { getShipments } from '../lib/api';
import { useDebounce } from '../hooks/useDebounce';
import { calculatePrice } from '../lib/pricing';
import { PaymentStatus } from './PaymentStatus';
import { DocumentViewer } from './documents/DocumentViewer';
import { BatchProcessor } from './documents/BatchProcessor';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export function ShipmentList() {
  const { t } = useLanguage();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedShipments, setExpandedShipments] = useState<Set<string>>(new Set());
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
    const loadShipments = async () => {
      try {
        setLoading(true);
        const data = await getShipments();
        setShipments(data);
      } catch (error) {
        console.error('Error loading shipments:', error);
        toast.error('Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };

    loadShipments();
  }, []);

  const filteredShipments = shipments.filter(shipment => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      shipment.trackingNumber.toLowerCase().includes(searchLower) ||
      shipment.sender.name.toLowerCase().includes(searchLower) ||
      shipment.recipient.name.toLowerCase().includes(searchLower)
    );
  });

  const toggleShipmentDetails = (id: string) => {
    setExpandedShipments(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Package2 className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t('nav.shipments')}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowBatchProcessor({ type: 'label', shipments: filteredShipments })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Batch Labels
            </button>
            <button
              onClick={() => setShowBatchProcessor({ type: 'invoice', shipments: filteredShipments })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Batch Invoices
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredShipments.map((shipment) => {
            const price = calculatePrice(
              shipment.mode,
              {
                food: shipment.weights?.food || 0,
                nonFood: shipment.weights?.nonFood || 0,
                hn7: shipment.weights?.hn7 || 0
              },
              shipment.mode === 'sea' ? {
                length: shipment.volume?.length || 0,
                width: shipment.volume?.width || 0,
                height: shipment.volume?.height || 0
              } : undefined,
              {
                amount: shipment.payment?.advanceAmount?.toString() || '0',
                currency: 'EUR'
              }
            );

            const isExpanded = expandedShipments.has(shipment.id);

            return (
              <div key={shipment.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div 
                  className="px-4 py-5 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleShipmentDetails(shipment.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {shipment.mode === 'air' ? (
                        <Plane className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Ship className="h-5 w-5 text-blue-500" />
                      )}
                      <div>
                        <span className="text-sm font-medium text-indigo-600">
                          {shipment.trackingNumber}
                        </span>
                        <div className="text-sm text-gray-500">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {shipment.origin} → {shipment.destination}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <PaymentStatus
                        status={price.paymentStatus}
                        baseAmount={price.baseAmountEUR}
                        advanceAmount={price.advanceAmountEUR}
                        remainingAmount={price.remainingEUR}
                        showRemainingOnly
                      />
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 py-5 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Sender</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">{shipment.sender.name}</p>
                          <p className="text-sm text-gray-500">{shipment.sender.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Recipient</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">{shipment.recipient.name}</p>
                          <p className="text-sm text-gray-500">{shipment.recipient.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <PaymentStatus
                        status={price.paymentStatus}
                        baseAmount={price.baseAmountEUR}
                        advanceAmount={price.advanceAmountEUR}
                        remainingAmount={price.remainingEUR}
                        currency="EUR"
                      />
                      <PaymentStatus
                        status={price.paymentStatus}
                        baseAmount={price.baseAmountXOF}
                        advanceAmount={price.advanceAmountXOF}
                        remainingAmount={price.remainingXOF}
                        currency="XOF"
                      />
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDocumentViewer({ type: 'label', shipment });
                        }}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print Label
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDocumentViewer({ type: 'invoice', shipment });
                        }}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Print Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <Package2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try searching with a different term.
            </p>
          </div>
        )}
      </div>

      {showDocumentViewer && (
        <DocumentViewer
          type={showDocumentViewer.type}
          shipment={showDocumentViewer.shipment}
          onClose={() => setShowDocumentViewer(null)}
        />
      )}

      {showBatchProcessor && (
        <BatchProcessor
          type={showBatchProcessor.type}
          shipments={showBatchProcessor.shipments}
          onClose={() => setShowBatchProcessor(null)}
        />
      )}
    </div>
  );
}