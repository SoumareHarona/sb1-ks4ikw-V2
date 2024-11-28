import { useState } from 'react';
import { Printer, Download, X } from 'lucide-react';
import type { Shipment } from '../../types';
import { generatePDF } from '../../lib/pdf';
import { createShippingLabel, createInvoice } from '../../lib/pdf/documents';
import { toast } from 'react-hot-toast';

interface DocumentViewerProps {
  shipment: Shipment;
  type: 'label' | 'invoice';
  onClose: () => void;
}

export function DocumentViewer({ shipment, type, onClose }: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    try {
      setLoading(true);
      const element = type === 'label' 
        ? createShippingLabel(shipment)
        : createInvoice(shipment);

      document.body.appendChild(element);
      const blob = await generatePDF(element, {
        format: type === 'label' ? 'a6' : 'a4'
      });
      document.body.removeChild(element);

      // Create object URL for downloading
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(url);
        };
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const element = type === 'label' 
        ? createShippingLabel(shipment)
        : createInvoice(shipment);

      document.body.appendChild(element);
      const blob = await generatePDF(element, {
        format: type === 'label' ? 'a6' : 'a4'
      });
      document.body.removeChild(element);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${shipment.trackingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === 'label' ? 'Shipping Label' : 'Invoice'} - {shipment.trackingNumber}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 h-[70vh] bg-gray-100">
          <div className="h-full flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <p className="text-gray-500">
                Click the Print or Download button above to view the document.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}