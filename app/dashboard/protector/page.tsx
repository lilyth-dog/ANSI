'use client';

import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Phone, AlertTriangle, TrendingUp, Users, Clock, Activity, Search, FileText } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function ProtectorDashboard() {
  // 특허 컨설팅 플랫폼용 투자자 대시보드
  const stats = {
    totalInvestments: 12,
    totalPortfolioValue: 2500000000,
    activeStartups: 8,
    thisMonthReturns: 15.2
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">투자자 대시보드</h1>
          <p className="text-gray-600 mt-2">투자 포트폴리오와 스타트업 현황을 모니터링하세요</p>
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
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalInvestments}</p>
              <p className="text-gray-600">총 투자 건수</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{(stats.totalPortfolioValue / 100000000).toFixed(1)}억</p>
              <p className="text-gray-600">포트폴리오 가치</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeStartups}</p>
              <p className="text-gray-600">활성 스타트업</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.thisMonthReturns}%</p>
              <p className="text-gray-600">이번 달 수익률</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 투자 포트폴리오 현황 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                투자 포트폴리오 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">T</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">테크스타트업</h4>
                      <Badge className="bg-green-100 text-green-800">성장</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      AI 특허 포트폴리오 • 투자금: 5억원
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      수익률: +23.5% • 마지막 업데이트: 2시간 전
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      상세보기
                    </Button>
                    <Button size="sm">연락하기</Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">I</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">인노베이션 코리아</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">안정</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      블록체인 특허 • 투자금: 3억원
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      수익률: +8.2% • 마지막 업데이트: 5시간 전
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      상세보기
                    </Button>
                    <Button size="sm">연락하기</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 투자 성과 추세 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                투자 성과 추세 (최근 7일)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "AI/ML", value: 85, color: "bg-blue-400" },
                  { name: "블록체인", value: 72, color: "bg-green-400" },
                  { name: "핀테크", value: 68, color: "bg-purple-400" },
                  { name: "헬스케어", value: 91, color: "bg-orange-400" }
                ].map((sector) => (
                  <div key={sector.name} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">
                      {sector.name}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${sector.color}`}
                        style={{ width: `${sector.value}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500 text-right">{sector.value}%</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">전반적 성과: 우수</p>
                <p className="text-xs text-green-600 mt-1">지난 주 대비 포트폴리오 가치가 8.5% 증가했습니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 알림 및 투자 활동 */}
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
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">테크스타트업 특허 침해 위험 알림</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">테크스타트업</Badge>
                      <span className="text-xs text-gray-500">2시간 전</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    확인
                  </Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">인노베이션 코리아 특허 등록 완료</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">인노베이션 코리아</Badge>
                      <span className="text-xs text-gray-500">5시간 전</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    확인
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 투자 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Search className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">테크스타트업</p>
                      <Badge className="bg-green-100 text-green-800">투자</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      AI 특허 포트폴리오 분석 • 2시간 전
                    </p>
                    <p className="text-xs text-gray-600 mt-1">투자금: 5억원 • 수익률: +23.5%</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    상세
                  </Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">인노베이션 코리아</p>
                      <Badge className="bg-blue-100 text-blue-800">분석</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      블록체인 특허 분석 완료 • 5시간 전
                    </p>
                    <p className="text-xs text-gray-600 mt-1">투자금: 3억원 • 수익률: +8.2%</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    상세
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
