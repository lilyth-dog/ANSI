'use client';

import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Phone, Calendar, Smile, Frown, Meh, PhoneCall, Clock, Search, FileText } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function SeniorDashboard() {
  // 특허 컨설팅 플랫폼용 스타트업 대표 대시보드
  const stats = {
    totalPatents: 15,
    pendingApplications: 3,
    completedAnalysis: 8,
    thisMonthSearches: 24
  }

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
          <h1 className="text-3xl font-bold text-gray-900">스타트업 대표 대시보드</h1>
          <p className="text-gray-600 mt-2">특허 포트폴리오와 컨설팅 현황을 확인하세요.</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPatents}</p>
              <p className="text-gray-600">총 특허 수</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingApplications}</p>
              <p className="text-gray-600">심사 대기 중</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.completedAnalysis}</p>
              <p className="text-gray-600">완료된 분석</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.thisMonthSearches}</p>
              <p className="text-gray-600">이번 달 검색</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 최근 특허 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                최근 특허 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Search className="h-6 w-6 text-blue-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">AI 특허</Badge>
                      <span className="text-xs text-gray-500">2시간 전</span>
                    </div>
                    <p className="text-sm text-gray-600">AI 기반 감정 분석 시스템 특허 검색 완료</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Heart className="h-6 w-6 text-green-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">블록체인</Badge>
                      <span className="text-xs text-gray-500">5시간 전</span>
                    </div>
                    <p className="text-sm text-gray-600">블록체인 기반 특허 관리 시스템 분석 완료</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 특허 상태 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                특허 상태 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "등록됨", count: 8, color: "bg-green-500" },
                  { name: "심사 중", count: 3, color: "bg-yellow-500" },
                  { name: "출원 대기", count: 2, color: "bg-blue-500" },
                  { name: "거절됨", count: 2, color: "bg-red-500" }
                ].map(({ name, count, color }) => (
                  <div key={name} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{name}</span>
                        <span className="text-sm text-gray-500">{count}건</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${color}`}
                          style={{ width: `${(count / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">전반적인 특허 상태</p>
                <p className="text-lg font-bold text-green-900 mt-1">양호 📈</p>
                <p className="text-xs text-green-600 mt-1">등록된 특허가 전체의 53%를 차지합니다!</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <Phone className="h-6 w-6 text-blue-500 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">특허 컨설팅</span>
                    <Badge className="bg-green-100 text-green-800">완료</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">AI 특허 포트폴리오 전략 수립</p>
                  <p className="text-xs text-gray-500">2시간 전</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">"특허 침해 위험도가 낮고, 시장 진입 전략이 명확합니다. 추가 특허 출원을 권장합니다."</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <Search className="h-6 w-6 text-purple-500 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">특허 분석</span>
                    <Badge className="bg-blue-100 text-blue-800">진행중</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">블록체인 특허 경쟁 분석</p>
                  <p className="text-xs text-gray-500">5시간 전</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">"경쟁사 특허 현황 분석 중입니다. 결과는 내일 오전에 제공됩니다."</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
