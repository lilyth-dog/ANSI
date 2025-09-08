'use client';

import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, TrendingUp, Shield, Activity, Clock, FileText } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function AdminDashboard() {
  // 특허 컨설팅 플랫폼용 관리자 대시보드
  const stats = {
    totalUsers: 156,
    totalSearches: 2847,
    totalAnalysis: 892,
    activeReports: 23
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">특허 컨설팅 플랫폼의 전체 현황을 모니터링하고 관리하세요</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</p>
              <p className="text-gray-600">전체 사용자</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalSearches}</p>
              <p className="text-gray-600">총 검색 수</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAnalysis}</p>
              <p className="text-gray-600">AI 분석 수</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeReports}</p>
              <p className="text-gray-600">활성 리포트</p>
            </CardContent>
          </Card>
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
                  <span className="text-sm text-gray-600">KIPRIS API</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">OpenAI API</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">OpenRouter API</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">데이터베이스</span>
                  <Badge className="bg-green-100 text-green-800">정상</Badge>
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
                {[
                  { role: "STARTUP_OWNER", label: "스타트업 대표", count: 89 },
                  { role: "CONSULTANT", label: "컨설턴트", count: 34 },
                  { role: "INVESTOR", label: "투자자", count: 23 },
                  { role: "ADMIN", label: "관리자", count: 10 }
                ].map(({ role, label, count }) => {
                  const percentage = (count / stats.totalUsers) * 100

                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
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
          {/* 최근 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                최근 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Search className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">새로운 특허 검색이 수행되었습니다</p>
                    <p className="text-xs text-gray-500 mt-1">AI 기반 감정 분석 시스템 • 2분 전</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">AI 분석이 완료되었습니다</p>
                    <p className="text-xs text-gray-500 mt-1">블록체인 특허 분석 • 5분 전</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">새로운 컨설팅 리포트가 생성되었습니다</p>
                    <p className="text-xs text-gray-500 mt-1">테크스타트업 컨설팅 • 10분 전</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시스템 성능 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                시스템 성능
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">평균 응답 시간</span>
                  <span className="text-sm font-medium">245ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API 성공률</span>
                  <span className="text-sm font-medium">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">캐시 적중률</span>
                  <span className="text-sm font-medium">87.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">데이터 압축률</span>
                  <span className="text-sm font-medium">42.1%</span>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">시스템 상태: 우수</p>
                  <p className="text-xs text-green-600 mt-1">모든 서비스가 정상적으로 작동하고 있습니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
