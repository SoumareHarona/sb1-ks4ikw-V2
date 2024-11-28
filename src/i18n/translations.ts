export const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      newShipment: 'New Shipment',
      shipments: 'Shipments',
      clients: 'Clients',
      logout: 'Logout'
    },
    dashboard: {
      title: 'Dashboard',
      activeShipments: 'Active Shipments',
      airFreight: 'Air Freight',
      seaFreight: 'Sea Freight',
      totalClients: 'Total Clients',
      recentShipments: 'Recent Shipments',
      trackingNumber: 'Tracking Number',
      route: 'Route',
      mode: 'Mode',
      status: 'Status',
      date: 'Date',
      refresh: 'Refresh',
      noShipments: 'No recent shipments found',
      seaFreightOverview: 'Sea Freight Overview',
      activeRoutes: 'Active Routes',
      totalVolume: 'Total Volume',
      popularRoutes: 'Popular Routes'
    },
    shipment: {
      create: 'Create New Shipment',
      freightNumbers: 'Freight Numbers',
      selectFreightNumber: 'Select a freight number',
      transportMode: 'Transport Mode',
      airFreight: 'Air Freight',
      seaFreight: 'Sea Freight',
      gpTransport: 'GP Transport',
      routeInfo: 'Route Information',
      origin: 'Origin Country',
      destination: 'Destination Country',
      senderInfo: 'Sender Information',
      recipientInfo: 'Recipient Information',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      weightInfo: 'Weight Information (kg)',
      foodWeight: 'Food Weight',
      nonFoodWeight: 'Non-Food Weight',
      hn7Weight: 'HN7 Weight',
      createButton: 'Create',
      freightNumber: 'Freight Number',
      preview: 'Preview',
      placeholder: {
        origin: 'Select origin country',
        destination: 'Select destination country',
        freightNumber: 'ex: 0001'
      }
    },
    status: {
      pending: 'Pending',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    validation: {
      originRequired: 'Please select an origin country',
      destinationRequired: 'Please select a destination country',
      numberRequired: 'Please enter a freight number',
      sameCountry: 'Origin and destination countries cannot be the same',
      numberFormat: 'Freight number must contain only digits'
    },
    common: {
      priceCalculation: 'Price Calculation',
      appliedRates: 'Applied Rates',
      baseAmount: 'Base Amount',
      advancePayment: 'Advance Payment',
      remaining: 'Remaining Balance',
      total: 'Total Amount'
    },
    rates: {
      perKg: '/kg',
      perCubicMeter: '/m³',
      air: {
        food: 'Food',
        nonFood: 'Non-Food',
        hn7: 'HN7'
      },
      sea: {
        volume: 'Volume Rate',
        minVolume: 'Minimum volume'
      }
    }
  },
  fr: {
    nav: {
      dashboard: 'Tableau de Bord',
      newShipment: 'Nouvelle Expédition',
      shipments: 'Expéditions',
      clients: 'Clients',
      logout: 'Déconnexion'
    },
    dashboard: {
      title: 'Tableau de Bord',
      activeShipments: 'Expéditions Actives',
      airFreight: 'Fret Aérien',
      seaFreight: 'Fret Maritime',
      totalClients: 'Total Clients',
      recentShipments: 'Expéditions Récentes',
      trackingNumber: 'Numéro de Suivi',
      route: 'Route',
      mode: 'Mode',
      status: 'Statut',
      date: 'Date',
      refresh: 'Actualiser',
      noShipments: 'Aucune expédition récente trouvée',
      seaFreightOverview: 'Aperçu du Fret Maritime',
      activeRoutes: 'Routes Actives',
      totalVolume: 'Volume Total',
      popularRoutes: 'Routes Populaires'
    },
    shipment: {
      create: 'Créer une Nouvelle Expédition',
      freightNumbers: 'Numéros de Fret',
      selectFreightNumber: 'Sélectionner un numéro de fret',
      transportMode: 'Mode de Transport',
      airFreight: 'Fret Aérien',
      seaFreight: 'Fret Maritime',
      gpTransport: 'Transport GP',
      routeInfo: 'Informations sur la Route',
      origin: 'Pays d\'Origine',
      destination: 'Pays de Destination',
      senderInfo: 'Informations sur l\'Expéditeur',
      recipientInfo: 'Informations sur le Destinataire',
      fullName: 'Nom et Prénom',
      phoneNumber: 'Numéro de Téléphone',
      weightInfo: 'Informations sur le Poids (kg)',
      foodWeight: 'Poids Alimentaire',
      nonFoodWeight: 'Poids Non-Alimentaire',
      hn7Weight: 'Poids HN7',
      createButton: 'Créer',
      freightNumber: 'Numéro de Fret',
      preview: 'Aperçu',
      placeholder: {
        origin: 'Sélectionner le pays d\'origine',
        destination: 'Sélectionner le pays de destination',
        freightNumber: 'ex: 0001'
      }
    },
    status: {
      pending: 'En Attente',
      in_transit: 'En Transit',
      delivered: 'Livré',
      cancelled: 'Annulé'
    },
    validation: {
      originRequired: 'Veuillez sélectionner un pays d\'origine',
      destinationRequired: 'Veuillez sélectionner un pays de destination',
      numberRequired: 'Veuillez saisir un numéro de fret',
      sameCountry: 'Les pays d\'origine et de destination ne peuvent pas être identiques',
      numberFormat: 'Le numéro de fret doit contenir uniquement des chiffres'
    },
    common: {
      priceCalculation: 'Calcul du Prix',
      appliedRates: 'Tarifs Appliqués',
      baseAmount: 'Montant de Base',
      advancePayment: 'Avance de Paiement',
      remaining: 'Reste à Payer',
      total: 'Montant Total'
    },
    rates: {
      perKg: '/kg',
      perCubicMeter: '/m³',
      air: {
        food: 'Alimentaire',
        nonFood: 'Non-Alimentaire',
        hn7: 'HN7'
      },
      sea: {
        volume: 'Tarif Volume',
        minVolume: 'Volume minimum'
      }
    }
  }
};