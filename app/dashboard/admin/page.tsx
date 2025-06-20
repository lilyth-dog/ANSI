import { Navigation } from "@/components/navigation"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockDashboardStats, mockUsers, getRecentAlerts, getCriticalAlerts } from "@/lib/mock-data"
import { Users, Phone, AlertTriangle, Shield, Activity, Clock, UserCheck } from "lucide-react"
import { formatDateTime, getSeverityColor } from "@/lib/utils"

export default function AdminDashboard() {
  // async 제거하고 직접 데이터 사용
  const stats = mockDashboardStats
  const recentAlerts = getRecentAlerts(3)
  const criticalAlerts = getCriticalAlerts()
  const recentUsers = mockUsers.slice(-3)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">시스템 전체 현황을 모니터링하고 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="전체 사용자"
            value={mockUsers.length}
            description="등록된 사용자 수"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="등록된 고령자"
            value={stats.totalSeniors}
            description="관리 대상자 수"
            icon={UserCheck}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="총 통화 수"
            value={stats.totalCalls}
            description="분석된 통화 기록"
            icon={Phone}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="활성 알림"
            value={stats.activeAlerts}
            description="처리 대기 중인 알림"
            icon={AlertTriangle}
            trend={{ value: -5, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 시스템 상태 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                시스템 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API 서버</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">데이터베이스</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">감정 분석 API</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">알림 시스템</span>
                  <Badge className="bg-yellow-100 text-yellow-800">점검 중</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 사용자 역할 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                사용자 역할 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["ADMIN", "COUNSELOR", "PROTECTOR", "SENIOR"].map((role) => {
                  const count = mockUsers.filter((user) => user.role === role).length
                  const percentage = (count / mockUsers.length) * 100

                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{role}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 긴급 알림 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                긴급 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.length > 0 ? (
                  criticalAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity === "critical" ? "긴급" : alert.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDateTime(alert.createdAt)}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        처리
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">긴급 알림이 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 최근 사용자 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 사용자 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.role} • {user.email}
                      </p>
                    </div>
                    <Badge variant="outline">{formatDateTime(user.createdAt)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
