import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Shipment } from '../../types';
import { format } from 'date-fns';

// Create styles for PDF documents
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4F46E5',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontSize: 10,
    color: '#666',
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  qrCode: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  }
});

interface PDFProps {
  shipment: Shipment;
}

export function ShippingLabel({ shipment }: PDFProps) {
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png"
            style={styles.logo}
          />
          <View>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>SOUTOURA FANA</Text>
            <Text style={{ fontSize: 10, color: '#666' }}>Air & Maritime Transport</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tracking No:</Text>
            <Text style={styles.value}>{shipment.trackingNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mode:</Text>
            <Text style={styles.value}>{shipment.mode.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Route:</Text>
            <Text style={styles.value}>{shipment.origin} → {shipment.destination}</Text>
          </View>
        </View>

        {shipment.qrCode && (
          <Image src={shipment.qrCode} style={styles.qrCode} />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{shipment.recipient.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{shipment.recipient.phone}</Text>
          </View>
          {shipment.recipient.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{shipment.recipient.email}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{shipment.packaging}</Text>
          </View>
          {shipment.weights?.total && (
            <View style={styles.row}>
              <Text style={styles.label}>Total Weight:</Text>
              <Text style={styles.value}>{shipment.weights.total} kg</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Generated on {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </Text>
      </Page>
    </Document>
  );
}

export function Invoice({ shipment }: PDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png"
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>
              Invoice #: INV-{shipment.trackingNumber}
              {'\n'}
              Date: {format(new Date(shipment.createdAt), 'dd/MM/yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.sectionTitle}>From</Text>
              <Text style={styles.value}>{shipment.sender.name}</Text>
              <Text style={styles.value}>{shipment.sender.phone}</Text>
              <Text style={styles.value}>{shipment.origin}</Text>
            </View>
            <View>
              <Text style={styles.sectionTitle}>To</Text>
              <Text style={styles.value}>{shipment.recipient.name}</Text>
              <Text style={styles.value}>{shipment.recipient.phone}</Text>
              <Text style={styles.value}>{shipment.destination}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <View style={{ ...styles.row, backgroundColor: '#F3F4F6', padding: 5 }}>
            <Text style={{ ...styles.label, fontWeight: 'bold' }}>Description</Text>
            <Text style={{ width: 80, fontSize: 10, fontWeight: 'bold' }}>Weight</Text>
            <Text style={{ width: 80, fontSize: 10, fontWeight: 'bold' }}>Rate</Text>
            <Text style={{ width: 80, fontSize: 10, fontWeight: 'bold' }}>Amount</Text>
          </View>

          {shipment.weights?.food && (
            <View style={styles.row}>
              <Text style={styles.label}>Food Items</Text>
              <Text style={{ width: 80, fontSize: 10 }}>{shipment.weights.food} kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€3.00/kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€{(shipment.weights.food * 3).toFixed(2)}</Text>
            </View>
          )}

          {shipment.weights?.nonFood && (
            <View style={styles.row}>
              <Text style={styles.label}>Non-Food Items</Text>
              <Text style={{ width: 80, fontSize: 10 }}>{shipment.weights.nonFood} kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€4.90/kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€{(shipment.weights.nonFood * 4.9).toFixed(2)}</Text>
            </View>
          )}

          {shipment.weights?.hn7 && (
            <View style={styles.row}>
              <Text style={styles.label}>HN7 Items</Text>
              <Text style={{ width: 80, fontSize: 10 }}>{shipment.weights.hn7} kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€7.00/kg</Text>
              <Text style={{ width: 80, fontSize: 10 }}>€{(shipment.weights.hn7 * 7).toFixed(2)}</Text>
            </View>
          )}
        </View>

        {shipment.payment && (
          <View style={{ ...styles.section, alignItems: 'flex-end' }}>
            <View style={styles.row}>
              <Text style={{ ...styles.label, fontWeight: 'bold' }}>Subtotal (EUR):</Text>
              <Text style={{ width: 100, fontSize: 10 }}>€{shipment.payment.baseAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ ...styles.label, fontWeight: 'bold' }}>Subtotal (XOF):</Text>
              <Text style={{ width: 100, fontSize: 10 }}>{Math.round(shipment.payment.baseAmountXOF).toLocaleString()} XOF</Text>
            </View>
            {shipment.payment.advanceAmount > 0 && (
              <>
                <View style={styles.row}>
                  <Text style={{ ...styles.label, fontWeight: 'bold' }}>Advance Payment:</Text>
                  <Text style={{ width: 100, fontSize: 10 }}>€{shipment.payment.advanceAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.label, fontWeight: 'bold', color: '#DC2626' }}>Balance Due (EUR):</Text>
                  <Text style={{ width: 100, fontSize: 10, color: '#DC2626' }}>€{shipment.payment.remainingAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{ ...styles.label, fontWeight: 'bold', color: '#DC2626' }}>Balance Due (XOF):</Text>
                  <Text style={{ width: 100, fontSize: 10, color: '#DC2626' }}>{Math.round(shipment.payment.remainingAmountXOF).toLocaleString()} XOF</Text>
                </View>
              </>
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Thank you for choosing SOUTOURA FANA Transport. For any questions about this invoice, please contact our customer service.
        </Text>
      </Page>
    </Document>
  );
}