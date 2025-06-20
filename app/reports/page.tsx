import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Calendar } from "lucide-react"
import { mockElderlyUsers, mockCallRecords, mockEmotionAnalysis } from "@/lib/mock"

export default function ReportsPage() {
  // async 제거하고 직접 데이터 사용
  const users = mockElderlyUsers
  const callRecords = mockCallRecords
  const emotionAnalysis = mockEmotionAnalysis

  // 월별 통화 수 계산
  const monthlyCallData = callRecords.reduce(
    (acc, call) => {
      const month = new Date(call.call_date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
      })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // 감정별 분포 계산
  const emotionDistribution = emotionAnalysis.reduce(
    (acc, analysis) => {
      acc[analysis.overall_sentiment] = (acc[analysis.overall_sentiment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // 사용자별 통화 빈도
  const userCallFrequency = users
    .map((user) => {
      const userCalls = callRecords.filter((call) => call.elderly_user_id === user.id)
      const userEmotions = emotionAnalysis.filter((emotion) =>
        userCalls.some((call) => call.id === emotion.call_record_id),
      )

      const avgSentiment =
        userEmotions.length > 0
          ? userEmotions.reduce((sum, emotion) => {
              return (
                sum + (emotion.overall_sentiment === "positive" ? 1 : emotion.overall_sentiment === "negative" ? -1 : 0)
              )
            }, 0) / userEmotions.length
          : 0

      return {
        name: user.name,
        callCount: userCalls.length,
        avgSentiment: avgSentiment.toFixed(2),
      }
    })
    .sort((a, b) => b.callCount - a.callCount)

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "긍정적"
      case "negative":
        return "부정적"
      default:
        return "중립적"
    }
  }

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">분석 리포트</h1>
          <p className="text-gray-600 mt-2">상세한 통계와 분석 결과를 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 월별 통화 수 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                월별 통화 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(monthlyCallData).map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(monthlyCallData))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 감정 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                전체 감정 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(emotionDistribution).map(([sentiment, count]) => (
                  <div key={sentiment} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{getSentimentLabel(sentiment)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            sentiment === "positive"
                              ? "bg-green-500"
                              : sentiment === "negative"
                                ? "bg-red-500"
                                : "bg-gray-500"
                          }`}
                          style={{ width: `${(count / emotionAnalysis.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용자별 통화 빈도 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              사용자별 통화 빈도 및 평균 감정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">이름</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">통화 수</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">평균 감정 점수</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {userCallFrequency.map((user, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.callCount}회</td>
                      <td className="py-3 px-4 text-gray-600">{user.avgSentiment}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            Number.parseFloat(user.avgSentiment) > 0
                              ? "bg-green-100 text-green-800"
                              : Number.parseFloat(user.avgSentiment) < 0
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {Number.parseFloat(user.avgSentiment) > 0
                            ? "양호"
                            : Number.parseFloat(user.avgSentiment) < 0
                              ? "주의"
                              : "보통"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
