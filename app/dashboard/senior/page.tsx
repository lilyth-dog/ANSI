import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockMoodEntries, getCallRecordsBySeniorId, getEmotionAnalysisByCallId } from "@/lib/mock-data"
import { Heart, Phone, Calendar, Smile, Frown, Meh, PhoneCall, Clock } from "lucide-react"
import { formatDateTime, formatDuration } from "@/lib/utils"

export default function SeniorDashboard() {
  // async 제거
  const seniorId = "senior-1" // Current senior user
  const recentMoods = mockMoodEntries.filter((mood) => mood.seniorId === seniorId).slice(-5)
  const recentCalls = getCallRecordsBySeniorId(seniorId).slice(-3)

  const moodIcons = {
    very_happy: { icon: Smile, color: "text-green-500", label: "매우 좋음" },
    happy: { icon: Smile, color: "text-green-400", label: "좋음" },
    neutral: { icon: Meh, color: "text-gray-400", label: "보통" },
    sad: { icon: Frown, color: "text-orange-400", label: "나쁨" },
    very_sad: { icon: Frown, color: "text-red-500", label: "매우 나쁨" },
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">안녕하세요! 👋</h1>
          <p className="text-gray-600 mt-2">오늘 하루는 어떠셨나요? 기분을 기록하고 언제든 통화하세요.</p>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PhoneCall className="h-6 w-6" />
                상담 전화하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">언제든지 편안하게 전화하세요. 상담사가 친절하게 도와드립니다.</p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Phone className="h-4 w-4 mr-2" />
                지금 통화하기
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-6 w-6" />
                오늘 기분 기록하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-4">
                오늘의 기분을 간단히 기록해보세요. 여러분의 마음을 이해하는데 도움이 됩니다.
              </p>
              <div className="flex gap-2">
                {Object.entries(moodIcons).map(([mood, { icon: Icon, color }]) => (
                  <Button
                    key={mood}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 최근 기분 기록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                최근 기분 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMoods.length > 0 ? (
                  recentMoods.reverse().map((mood) => {
                    const { icon: Icon, color, label } = moodIcons[mood.mood]
                    return (
                      <div key={mood.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className={`h-6 w-6 ${color} mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{label}</Badge>
                            <span className="text-xs text-gray-500">{formatDateTime(mood.createdAt)}</span>
                          </div>
                          {mood.notes && <p className="text-sm text-gray-600">{mood.notes}</p>}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">아직 기분 기록이 없습니다</p>
                    <p className="text-sm text-gray-400">위의 버튼을 눌러 오늘의 기분을 기록해보세요</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 기분 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                이번 주 기분 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(moodIcons).map(([mood, { icon: Icon, color, label }]) => {
                  // Mock data for demonstration
                  const count = Math.floor(Math.random() * 3)
                  const percentage = count > 0 ? (count / 7) * 100 : 0

                  return (
                    <div key={mood} className="flex items-center gap-4">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{label}</span>
                          <span className="text-sm text-gray-500">{count}일</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">이번 주 전반적인 기분</p>
                <p className="text-lg font-bold text-blue-900 mt-1">좋음 😊</p>
                <p className="text-xs text-blue-600 mt-1">지난 주보다 긍정적인 날이 많았어요!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 통화 기록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              최근 통화 기록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.length > 0 ? (
                recentCalls.reverse().map((call) => {
                  const emotion = getEmotionAnalysisByCallId(call.id)
                  return (
                    <div key={call.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-500 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">상담 통화</span>
                          {emotion && (
                            <Badge
                              className={
                                emotion.overallSentiment === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : emotion.overallSentiment === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {emotion.overallSentiment === "positive"
                                ? "긍정적"
                                : emotion.overallSentiment === "negative"
                                  ? "부정적"
                                  : "중립적"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">통화 시간: {formatDuration(call.duration)}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(call.timestamp)}</p>
                        {call.transcript && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">"{call.transcript.substring(0, 100)}..."</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">아직 통화 기록이 없습니다</p>
                  <p className="text-sm text-gray-400">언제든지 편안하게 전화해주세요</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
