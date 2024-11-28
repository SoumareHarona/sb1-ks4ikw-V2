import { useState, useEffect } from 'react';
import { Printer, Download, X, Loader2 } from 'lucide-react';
import type { Shipment } from '../../types';
import { generatePDF, createShippingLabel, createInvoice } from '../../lib/pdf';
import { toast } from 'react-hot-toast';

interface BatchProcessorProps {
  shipments: Shipment[];
  type: 'label' | 'invoice';
  onClose: () => void;
}

export function BatchProcessor({ shipments, type, onClose }: BatchProcessorProps) {
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (selectedShipments.size > 0) {
      generateCombinedPDF();
    }
  }, [selectedShipments, retryCount]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedShipments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedShipments(newSelection);
  };

  const toggleAll = () => {
    if (selectedShipments.size === shipments.length) {
      setSelectedShipments(new Set());
    } else {
      setSelectedShipments(new Set(shipments.map(s => s.id)));
    }
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      toast.loading('Retrying document generation...');
    } else {
      toast.error('Maximum retry attempts reached. Please try again later.');
    }
  };

  const generateCombinedPDF = async () => {
    try {
      setProcessing(true);
      setError(null);

      const selectedDocs = shipments.filter(s => selectedShipments.has(s.id));
      
      // Create a container for all documents
      const container = document.createElement('div');
      container.style.width = type === 'label' ? '148mm' : '210mm';
      container.style.backgroundColor = 'white';

      // Generate each document and append to container
      selectedDocs.forEach(shipment => {
        const doc = type === 'label' 
          ? createShippingLabel(shipment)
          : createInvoice(shipment);
        
        // Add page break between documents
        doc.style.pageBreakAfter = 'always';
        container.appendChild(doc);
      });

      // Add container to DOM temporarily
      document.body.appendChild(container);

      // Generate PDF
      const blob = await generatePDF(container, {
        format: type === 'label' ? 'a6' : 'a4'
      });

      // Remove temporary container
      document.body.removeChild(container);

      setPdfBlob(blob);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate documents';
      console.error('Document generation error:', error);
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = async () => {
    if (!pdfBlob) {
      toast.error('Documents not ready for printing');
      return;
    }

    try {
      setProcessing(true);
      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Batch ${type === 'label' ? 'Labels' : 'Invoices'}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  iframe { border: none; }
                  @page { size: auto; margin: 0mm; }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0;">
              <iframe 
                src="${url}" 
                style="width: 100%; height: 100vh; border: none;"
                onload="setTimeout(() => { window.print(); window.close(); }, 1000);"
              ></iframe>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to print documents';
      console.error('Print error:', error);
      toast.error(message);
    } finally {
      setProcessing(false);
      if (pdfBlob) {
        URL.revokeObjectURL(URL.createObjectURL(pdfBlob));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Batch Process {type === 'label' ? 'Labels' : 'Invoices'}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedShipments.size === shipments.length}
                onChange={toggleAll}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Select All</span>
            </label>
            <span className="text-sm text-gray-500">
              {selectedShipments.size} of {shipments.length} selected
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {shipments.map(shipment => (
              <div
                key={shipment.id}
                className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedShipments.has(shipment.id)}
                  onChange={() => toggleSelection(shipment.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {shipment.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {shipment.recipient.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              {retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-sm text-red-600 hover:text-red-500"
                >
                  Retry ({maxRetries - retryCount} attempts remaining)
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            disabled={selectedShipments.size === 0 || processing || !pdfBlob}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Printer className="h-4 w-4 mr-2" />
            )}
            Print Selected
          </button>
          {pdfBlob && (
            <a
              href={URL.createObjectURL(pdfBlob)}
              download={`batch-${type}-${new Date().toISOString()}.pdf`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Selected
            </a>
          )}
        </div>
      </div>
    </div>
  );
}