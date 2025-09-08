'use client';

import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertTriangle, Headphones, Calendar, Clock, Search, TrendingUp } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function CounselorDashboard() {
  // 특허 컨설팅 플랫폼용 컨설턴트 대시보드
  const stats = {
    totalClients: 24,
    completedConsultations: 156,
    pendingReports: 8,
    thisWeekConsultations: 12
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">컨설턴트 대시보드</h1>
          <p className="text-gray-600 mt-2">스타트업 특허 컨설팅 현황을 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalClients}</p>
              <p className="text-gray-600">담당 클라이언트</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.completedConsultations}</p>
              <p className="text-gray-600">완료된 컨설팅</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingReports}</p>
              <p className="text-gray-600">대기 중인 리포트</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.thisWeekConsultations}</p>
              <p className="text-gray-600">이번 주 컨설팅</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 긴급 컨설팅 요청 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                긴급 컨설팅 요청
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">T</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">테크스타트업</p>
                    <p className="text-xs text-gray-500">
                      특허 침해 소송 위험 • 긴급
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">긴급</Badge>
                  <Button size="sm" variant="outline">
                    상담
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-yellow-600">I</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">인노베이션 코리아</p>
                    <p className="text-xs text-gray-500">
                      특허 출원 전략 수립 • 보통
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>
                  <Button size="sm" variant="outline">
                    상담
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 최근 컨설팅 기록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 컨설팅 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">S</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">스마트솔루션</p>
                    <p className="text-xs text-gray-500 truncate">AI 특허 포트폴리오 분석 완료</p>
                    <p className="text-xs text-gray-400 mt-1">2시간 전</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    상세
                  </Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">D</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">데이터랩</p>
                    <p className="text-xs text-gray-500 truncate">특허 검색 및 분석 서비스</p>
                    <p className="text-xs text-gray-400 mt-1">5시간 전</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    상세
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 컨설팅 노트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                최근 컨설팅 노트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">테크스타트업</h4>
                    <Badge className="bg-red-100 text-red-800">높음</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">특허 침해 위험도가 높아 즉시 대응이 필요합니다.</p>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">권장사항:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        기존 특허와의 차별화 요소 강화
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        특허 무효화 소송 대비
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>2시간 전</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      추적: 내일 오전 10:00
                    </span>
                  </div>
                </div>
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
                    <p className="text-sm font-medium text-gray-900">테크스타트업 긴급 상담</p>
                    <p className="text-xs text-gray-500">오늘 오후 2:00</p>
                  </div>
                  <Button size="sm">참여</Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">인노베이션 코리아 컨설팅</p>
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
