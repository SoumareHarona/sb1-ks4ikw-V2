import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@tremor/react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend: number;
  color: string;
  index: number;
}

export function StatCard({ icon: Icon, label, value, trend, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value.toLocaleString()}
                </div>
                {trend > 0 && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="ml-1">+{trend}%</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}