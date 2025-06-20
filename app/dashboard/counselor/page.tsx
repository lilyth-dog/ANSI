import { Navigation } from "@/components/navigation"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  mockSeniors,
  mockCounselingNotes,
  getRecentCallRecords,
  getHighRiskSeniors,
  getSeniorById,
} from "@/lib/mock-data"
import { Users, FileText, AlertTriangle, Headphones, Calendar, Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function CounselorDashboard() {
  const assignedSeniors = mockSeniors.filter((senior) => senior.counselorId === "counselor-1")
  const recentCalls = getRecentCallRecords(5)
  const highRiskSeniors = getHighRiskSeniors()
  const recentNotes = mockCounselingNotes.slice(-3)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">상담자 대시보드</h1>
          <p className="text-gray-600 mt-2">담당 고령자들의 상담 현황을 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="담당 고령자"
            value={assignedSeniors.length}
            description="상담 담당 대상자"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="상담 노트"
            value={mockCounselingNotes.length}
            description="작성된 상담 기록"
            icon={FileText}
            trend={{ value: 20, isPositive: true }}
          />
          <StatsCard
            title="고위험 대상자"
            value={highRiskSeniors.length}
            description="집중 관리 필요"
            icon={AlertTriangle}
            trend={{ value: -10, isPositive: true }}
          />
          <StatsCard
            title="이번 주 상담"
            value={8}
            description="완료된 상담 세션"
            icon={Headphones}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 고위험 대상자 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                고위험 대상자
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highRiskSeniors.length > 0 ? (
                  highRiskSeniors.map((senior) => (
                    <div
                      key={senior.id}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600">{senior.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{senior.name}</p>
                        <p className="text-xs text-gray-500">
                          {senior.age}세 • {senior.phoneNumber}
                        </p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">고위험</Badge>
                      <Button size="sm" variant="outline">
                        상담
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">고위험 대상자가 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>

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
                {recentCalls.map((call) => {
                  const senior = getSeniorById(call.seniorId)
                  return (
                    <div key={call.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">{senior?.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{senior?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{call.transcript?.substring(0, 50)}...</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDateTime(call.timestamp)}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        분석
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 상담 노트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                최근 상담 노트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => {
                  const senior = getSeniorById(note.seniorId)
                  return (
                    <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{senior?.name}</h4>
                        <Badge
                          className={
                            note.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : note.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {note.priority === "high" ? "높음" : note.priority === "medium" ? "보통" : "낮음"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{note.content}</p>
                      {note.interventionSuggestions && note.interventionSuggestions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">개입 제안:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {note.interventionSuggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDateTime(note.createdAt)}</span>
                        {note.followUpDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            추적: {formatDateTime(note.followUpDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 이번 주 일정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                이번 주 일정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">김영희님 정기 상담</p>
                    <p className="text-xs text-gray-500">오늘 오후 2:00</p>
                  </div>
                  <Button size="sm">참여</Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">박철수님 추적 상담</p>
                    <p className="text-xs text-gray-500">내일 오전 10:00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    예약
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">팀 미팅</p>
                    <p className="text-xs text-gray-500">금요일 오후 4:00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    참여
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
