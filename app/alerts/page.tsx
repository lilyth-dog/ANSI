import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Heart, Activity, Clock, User } from "lucide-react"

// Mock data for alerts and elderly users
const mockAlerts = [
  {
    id: "1",
    elderly_user_id: "101",
    alert_type: "emotional_distress",
    severity: "medium",
    message: "사용자가 불안정한 감정 상태를 보입니다.",
    is_resolved: false,
    created_at: "2024-10-27T10:00:00Z",
    resolved_at: null,
  },
  {
    id: "2",
    elderly_user_id: "102",
    alert_type: "health_concern",
    severity: "high",
    message: "사용자의 심박수가 비정상적으로 높습니다.",
    is_resolved: true,
    created_at: "2024-10-26T14:30:00Z",
    resolved_at: "2024-10-26T15:00:00Z",
  },
]

const mockElderlyUsers = [
  { id: "101", name: "김영수" },
  { id: "102", name: "박철수" },
]

export default function AlertsPage() {
  // async 제거하고 직접 데이터 사용
  const alerts = mockAlerts.map((alert) => ({
    ...alert,
    elderly_user: mockElderlyUsers.find((user) => user.id === alert.elderly_user_id),
  }))

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

  const typeLabels = {
    emotional_distress: "감정적 고통",
    emergency: "응급상황",
    health_concern: "건강 우려",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR")
  }

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">알림 관리</h1>
          <p className="text-gray-600 mt-2">고령자들의 상태 알림을 확인하고 관리하세요</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alertIcons[alert.alert_type]
            return (
              <Card key={alert.id} className={`${alert.is_resolved ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{typeLabels[alert.alert_type]}</span>
                          <Badge className={alertColors[alert.severity]}>{severityLabels[alert.severity]}</Badge>
                          {alert.is_resolved && <Badge variant="outline">해결됨</Badge>}
                        </div>
                      </div>
                    </CardTitle>
                    {!alert.is_resolved && (
                      <Button variant="outline" size="sm">
                        해결 처리
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-900">{alert.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {alert.elderly_user?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(alert.created_at)}
                      </div>
                    </div>

                    {alert.is_resolved && alert.resolved_at && (
                      <div className="text-sm text-green-600">해결 완료: {formatDate(alert.resolved_at)}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
