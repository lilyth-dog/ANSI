import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, User } from "lucide-react"
import { mockCallRecords, mockElderlyUsers, mockEmotionAnalysis } from "@/lib/mock"

export default function CallsPage() {
  // async 제거하고 직접 데이터 사용
  const callRecords = mockCallRecords.map((record) => ({
    ...record,
    elderly_user: mockElderlyUsers.find((user) => user.id === record.elderly_user_id),
  }))

  const emotionAnalysis = mockEmotionAnalysis.map((analysis) => ({
    ...analysis,
    call_record: mockCallRecords.find((record) => record.id === analysis.call_record_id),
  }))

  const getEmotionForCall = (callId: number) => {
    return emotionAnalysis.find((emotion) => emotion.call_record_id === callId)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}분 ${remainingSeconds}초`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">통화 기록</h1>
          <p className="text-gray-600 mt-2">고령자들의 통화 기록과 감정 분석 결과를 확인하세요</p>
        </div>

        <div className="space-y-6">
          {callRecords.map((call) => {
            const emotion = getEmotionForCall(call.id)
            return (
              <Card key={call.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {call.elderly_user?.name}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      {emotion && (
                        <Badge className={getSentimentColor(emotion.overall_sentiment)}>
                          {getSentimentLabel(emotion.overall_sentiment)}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {formatDuration(call.duration)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        {new Date(call.call_date).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">통화 내용</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {call.transcript || "통화 내용이 없습니다."}
                      </p>
                    </div>

                    {emotion && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">감정 분석 결과</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {(emotion.happiness_score * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-500">행복</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(emotion.sadness_score * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-500">슬픔</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {(emotion.anger_score * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-500">분노</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {(emotion.fear_score * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-500">두려움</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {(emotion.surprise_score * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-500">놀라움</div>
                          </div>
                        </div>

                        {emotion.keywords.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">주요 키워드</h5>
                            <div className="flex flex-wrap gap-2">
                              {emotion.keywords.map((keyword, index) => (
                                <Badge key={index} variant="outline">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
