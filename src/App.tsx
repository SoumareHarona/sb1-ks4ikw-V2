import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CreateShipment } from './components/CreateShipment';
import { ShipmentList } from './components/ShipmentList';
import { ClientList } from './components/clients/ClientList';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-shipment" element={<CreateShipment />} />
            <Route path="/shipments" element={<ShipmentList />} />
            <Route path="/clients" element={<ClientList />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </LanguageProvider>
  );
}

export default App;