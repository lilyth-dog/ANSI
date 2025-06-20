import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/types"
import { AlertTriangle, Heart, Activity } from "lucide-react"

interface RecentAlertsProps {
  alerts: Alert[]
}

const alertIcons = {
  emotional_distress: AlertTriangle,
  emergency: Heart,
  health_concern: Activity,
}

const alertColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const severityLabels = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "긴급",
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 알림</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.slice(0, 5).map((alert) => {
            const Icon = alertIcons[alert.alert_type]
            return (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={alertColors[alert.severity]}>{severityLabels[alert.severity]}</Badge>
                    <span className="text-xs text-gray-500">{alert.elderly_user?.name}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
