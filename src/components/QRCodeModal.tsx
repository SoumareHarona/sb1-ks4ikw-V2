interface QRCodeModalProps {
  qrCode: string;
  trackingNumber: string;
  onClose: () => void;
}

export function QRCodeModal({ qrCode, trackingNumber, onClose }: QRCodeModalProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SOUTOURA FANA - QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              img {
                max-width: 300px;
                height: auto;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              .tracking-number {
                margin: 20px 0;
                font-size: 18px;
                font-weight: bold;
              }
              .company-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #4F46E5;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="company-name">SOUTOURA FANA</div>
              <img src="${qrCode}" alt="QR Code" />
              <div class="tracking-number">
                Numéro de suivi: ${trackingNumber}
              </div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">SOUTOURA FANA</h3>
          <img 
            src={qrCode} 
            alt="QR Code" 
            className="w-64 h-64 mb-4"
          />
          <p className="text-lg font-semibold mb-2">Numéro de suivi:</p>
          <p className="text-xl font-bold mb-4 text-center break-all">
            {trackingNumber}
          </p>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Utilisez ce QR code pour le suivi de votre colis
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}