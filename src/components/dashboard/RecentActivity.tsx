import { motion } from "framer-motion";
import { Calendar, MapPin, Plane, Ship } from "lucide-react";
import { Card, Title } from "@tremor/react";
import { format } from "date-fns";
import type { Shipment } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";

interface RecentActivityProps {
  shipments: Shipment[];
}

export function RecentActivity({ shipments }: RecentActivityProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <Title>Recent Activity</Title>
      <div className="mt-4 space-y-4">
        {shipments.length > 0 ? (
          shipments.slice(0, 5).map((shipment, index) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              {shipment.mode === 'air' ? (
                <Plane className="h-5 w-5 text-blue-500 mr-3" />
              ) : (
                <Ship className="h-5 w-5 text-blue-500 mr-3" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {shipment.trackingNumber}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {shipment.origin} → {shipment.destination}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  shipment.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : shipment.status === 'in_transit'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {t(`status.${shipment.status}`)}
                </span>
                <div className="mt-1 flex items-center justify-end text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(shipment.createdAt), 'dd MMM yyyy')}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No recent shipments found
          </div>
        )}
      </div>
    </Card>
  );
}