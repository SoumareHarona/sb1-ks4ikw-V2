import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import type { Shipment } from '../../types';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
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
  companyInfo: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companySubtext: {
    fontSize: 10,
    color: '#6B7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4F46E5',
  },
  trackingInfo: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    marginBottom: 15,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 80,
    fontSize: 10,
    color: '#6B7280',
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrCode: {
    width: 120,
    height: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#9CA3AF',
  }
});

interface ShippingLabelProps {
  shipment: Shipment;
}

export function ShippingLabelDocument({ shipment }: ShippingLabelProps) {
  return (
    <Document>
      <Page>
        <View style={styles.page}>
          <View style={styles.header}>
            <Image
              src="https://storage.googleapis.com/mixo-sites/images/file-91ebda5e-477e-4c50-84b5-07494530cd73.png"
              style={styles.logo}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>SOUTOURA FANA</Text>
              <Text style={styles.companySubtext}>Air & Maritime Transport</Text>
            </View>
          </View>

          <View style={styles.trackingInfo}>
            <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Mode:</Text>
              <Text style={styles.value}>{shipment.mode.toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Route:</Text>
              <Text style={styles.value}>{shipment.origin} → {shipment.destination}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{format(new Date(shipment.createdAt), 'dd/MM/yyyy')}</Text>
            </View>
          </View>

          {shipment.qrCode && (
            <View style={styles.qrCodeContainer}>
              <Image src={shipment.qrCode} style={styles.qrCode} />
            </View>
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
            For any inquiries about your shipment, please contact our customer service
          </Text>
        </View>
      </Page>
    </Document>
  );
}