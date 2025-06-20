import { Navigation } from "@/components/navigation"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  mockSeniors,
  getCallRecordsBySeniorId,
  getEmotionAnalysisByCallId,
  getRecentAlerts,
  getSeniorById,
} from "@/lib/mock-data"
import { Heart, Phone, AlertTriangle, TrendingUp, Users, Clock, Activity } from "lucide-react"
import { formatDateTime, getSentimentColor, formatDuration } from "@/lib/utils"

export default function ProtectorDashboard() {
  const protectedSeniors = mockSeniors.filter((senior) => senior.protectorIds.includes("protector-1"))

  const allCalls = protectedSeniors.flatMap((senior) => getCallRecordsBySeniorId(senior.id))

  const recentAlerts = getRecentAlerts(5).filter((alert) =>
    protectedSeniors.some((senior) => senior.id === alert.seniorId),
  )

  const todayCalls = allCalls.filter((call) => {
    const today = new Date()
    const callDate = new Date(call.timestamp)
    return callDate.toDateString() === today.toDateString()
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">보호자 대시보드</h1>
          <p className="text-gray-600 mt-2">보호 대상자들의 감정 상태와 통화 현황을 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="보호 대상자"
            value={protectedSeniors.length}
            description="관리 중인 고령자"
            icon={Users}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="총 통화 수"
            value={allCalls.length}
            description="전체 통화 기록"
            icon={Phone}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="오늘 통화"
            value={todayCalls.length}
            description="오늘 진행된 통화"
            icon={Activity}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="활성 알림"
            value={recentAlerts.filter((alert) => !alert.isResolved).length}
            description="확인 필요한 알림"
            icon={AlertTriangle}
            trend={{ value: -15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 보호 대상자 현황 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                보호 대상자 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protectedSeniors.map((senior) => {
                  const seniorCalls = getCallRecordsBySeniorId(senior.id)
                  const lastCall = seniorCalls[seniorCalls.length - 1]
                  const lastEmotion = lastCall ? getEmotionAnalysisByCallId(lastCall.id) : null

                  return (
                    <div key={senior.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{senior.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{senior.name}</h4>
                          {lastEmotion && (
                            <Badge className={getSentimentColor(lastEmotion.overallSentiment)}>
                              {lastEmotion.overallSentiment === "positive"
                                ? "긍정적"
                                : lastEmotion.overallSentiment === "negative"
                                  ? "부정적"
                                  : "중립적"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {senior.age}세 • {senior.phoneNumber}
                        </p>
                        {lastCall && (
                          <p className="text-xs text-gray-400 mt-1">
                            마지막 통화: {formatDateTime(lastCall.timestamp)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          통화 기록
                        </Button>
                        <Button size="sm">연락하기</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 감정 추세 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                감정 추세 (최근 7일)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["happiness", "sadness", "anger", "fear"].map((emotion) => {
                  const emotionLabels = {
                    happiness: "행복",
                    sadness: "슬픔",
                    anger: "분노",
                    fear: "두려움",
                  }

                  const emotionColors = {
                    happiness: "bg-yellow-400",
                    sadness: "bg-blue-400",
                    anger: "bg-red-400",
                    fear: "bg-purple-400",
                  }

                  // Mock data for demonstration
                  const value = Math.random() * 0.6 + 0.2

                  return (
                    <div key={emotion} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">
                        {emotionLabels[emotion as keyof typeof emotionLabels]}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${emotionColors[emotion as keyof typeof emotionColors]}`}
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-gray-500 text-right">{(value * 100).toFixed(0)}%</div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">전반적 상태: 안정적</p>
                <p className="text-xs text-blue-600 mt-1">지난 주 대비 긍정적 감정이 15% 증가했습니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 알림 및 통화 기록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                최근 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert) => {
                    const senior = getSeniorById(alert.seniorId)
                    return (
                      <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{senior?.name}</Badge>
                            <span className="text-xs text-gray-500">{formatDateTime(alert.createdAt)}</span>
                          </div>
                        </div>
                        {!alert.isResolved && (
                          <Button size="sm" variant="outline">
                            확인
                          </Button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">최근 알림이 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 통화 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allCalls
                  .slice(-5)
                  .reverse()
                  .map((call) => {
                    const senior = getSeniorById(call.seniorId)
                    const emotion = getEmotionAnalysisByCallId(call.id)

                    return (
                      <div key={call.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900">{senior?.name}</p>
                            {emotion && (
                              <Badge className={getSentimentColor(emotion.overallSentiment)}>
                                {emotion.overallSentiment === "positive"
                                  ? "긍정"
                                  : emotion.overallSentiment === "negative"
                                    ? "부정"
                                    : "중립"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDuration(call.duration)} • {formatDateTime(call.timestamp)}
                          </p>
                          {call.transcript && (
                            <p className="text-xs text-gray-600 mt-1 truncate">{call.transcript.substring(0, 60)}...</p>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          상세
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
