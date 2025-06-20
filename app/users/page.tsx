import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Calendar, AlertCircle } from "lucide-react"

// Mock data (replace with actual data fetching later)
const mockElderlyUsers = [
  {
    id: 1,
    name: "김영수",
    age: 75,
    phone: "010-1234-5678",
    emergency_contact: "010-9876-5432",
    medical_conditions: "고혈압",
  },
  {
    id: 2,
    name: "박철수",
    age: 82,
    phone: "010-2345-6789",
    emergency_contact: "010-8765-4321",
    medical_conditions: "당뇨병",
  },
  {
    id: 3,
    name: "오미자",
    age: 79,
    phone: "010-3456-7890",
    emergency_contact: "010-7654-3210",
    medical_conditions: "골다공증",
  },
]

const mockCallRecords = [
  { id: 101, elderly_user_id: 1, call_date: "2024-10-26T10:00:00.000Z" },
  { id: 102, elderly_user_id: 1, call_date: "2024-10-27T11:00:00.000Z" },
  { id: 103, elderly_user_id: 2, call_date: "2024-10-27T12:00:00.000Z" },
  { id: 104, elderly_user_id: 3, call_date: "2024-10-28T13:00:00.000Z" },
]

const mockEmotionAnalysis = [
  { id: 201, call_record_id: 101, overall_sentiment: "positive" },
  { id: 202, call_record_id: 102, overall_sentiment: "negative" },
  { id: 203, call_record_id: 103, overall_sentiment: "neutral" },
  { id: 204, call_record_id: 104, overall_sentiment: "positive" },
]

export default function UsersPage() {
  // async 제거하고 직접 데이터 사용
  const users = mockElderlyUsers
  const callRecords = mockCallRecords
  const emotionAnalysis = mockEmotionAnalysis

  const getUserStats = (userId: number) => {
    const userCalls = callRecords.filter((call) => call.elderly_user_id === userId)
    const userEmotions = emotionAnalysis.filter((emotion) =>
      userCalls.some((call) => call.id === emotion.call_record_id),
    )

    const recentSentiment =
      userEmotions.length > 0 ? userEmotions[userEmotions.length - 1].overall_sentiment : "neutral"

    return {
      totalCalls: userCalls.length,
      recentSentiment,
      lastCallDate:
        userCalls.length > 0 ? new Date(userCalls[userCalls.length - 1].call_date).toLocaleDateString("ko-KR") : "없음",
    }
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
          <h1 className="text-3xl font-bold text-gray-900">고령자 관리</h1>
          <p className="text-gray-600 mt-2">등록된 고령자들의 정보와 상태를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const stats = getUserStats(user.id)
            return (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentColor(stats.recentSentiment)}>
                      {getSentimentLabel(stats.recentSentiment)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">나이:</span>
                      <span className="font-medium">{user.age}세</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">연락처:</span>
                      <span className="font-medium">{user.phone}</span>
                    </div>

                    {user.emergency_contact && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">비상연락처:</span>
                        <span className="font-medium">{user.emergency_contact}</span>
                      </div>
                    )}

                    {user.medical_conditions && (
                      <div className="text-sm">
                        <span className="text-gray-600">의료 상태:</span>
                        <p className="font-medium mt-1 text-gray-900">{user.medical_conditions}</p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">총 통화 수:</span>
                        <span className="font-medium">{stats.totalCalls}회</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">마지막 통화:</span>
                        <span className="font-medium">{stats.lastCallDate}</span>
                      </div>
                    </div>
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
