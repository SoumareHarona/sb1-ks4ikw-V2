import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Package2, Users, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', label: t('nav.dashboard'), icon: Package2 },
    { id: '/create-shipment', label: t('nav.newShipment'), icon: Plus },
    { id: '/shipments', label: t('nav.shipments'), icon: Package2 },
    { id: '/clients', label: t('nav.clients'), icon: Users },
  ];

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <img 
          src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png" 
                alt="SOUTOURA FANA Logo" 
                className="h-10 w-auto"
              />
              <span className="text-white font-bold text-xl">SOUTOURA FANA</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`${
                        location.pathname === item.id
                          ? 'bg-indigo-700 text-white'
                          : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitch />
            <button className="flex items-center space-x-2 bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition-colors">
              <LogOut className="h-4 w-4" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-500 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${
                    location.pathname === item.id
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <LanguageSwitch />
            <button className="flex items-center space-x-2 text-gray-300 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full">
              <LogOut className="h-4 w-4" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}