import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Phone, BarChart3, Shield, Users, Headphones } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SilverCare</h1>
            </div>
            <Link href="/dashboard/admin">
              <Button>대시보드 접속</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            고령자를 위한
            <span className="text-blue-600"> 감정 케어</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            전화 기반 AI 감정 분석으로 고령자의 정신 건강을 모니터링하고, 
            가족과 상담자가 함께 돌봄을 제공하는 통합 플랫폼입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/admin">
              <Button size="lg" className="w-full sm:w-auto">
                관리자 대시보드
              </Button>
            </Link>
            <Link href="/dashboard/protector">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                보호자 대시보드
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4가지 역할별 맞춤 서비스
            </h2>
            <p className="text-lg text-gray-600">
              각 사용자의 역할에 맞는 전용 대시보드와 기능을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>관리자</CardTitle>
                <CardDescription>시스템 전체 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 사용자 관리</li>
                  <li>• IAM 권한 설정</li>
                  <li>• 시스템 로그 모니터링</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Headphones className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>상담자</CardTitle>
                <CardDescription>전문 상담 서비스</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 상담 기록 관리</li>
                  <li>• 개입 제안</li>
                  <li>• 위험도 평가</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>보호자</CardTitle>
                <CardDescription>가족 돌봄 지원</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 통화 기록 확인</li>
                  <li>• 감정 추세 분석</li>
                  <li>• 알림 수신</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>대상자</CardTitle>
                <CardDescription>고령자 본인</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 기분 기록</li>
                  <li>• 간편 통화</li>
                  <li>• 개인 현황 확인</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              첨단 기술로 안전한 돌봄
            </h2>
            <p className="text-lg text-gray-600">
              Google Cloud와 Firebase를 활용한 안정적이고 확장 가능한 플랫폼
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 감정 분석</h3>
              <p className="text-gray-600">
                통화 내용을 실시간으로 분석하여 감정 상태를 정확하게 파악합니다
              </p>
            </div>

            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">실시간 모니터링</h3>
              <p className="text-gray-600">
                감정 변화를 실시간으로 추적하고 위험 상황을 조기에 감지합니다
              </p>
            </div>

            <div className="text-center">
              <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">보안 및 프라이버시</h3>
              <p className="text-gray-600">
                Google Cloud 보안 기술로 개인정보를 안전하게 보호합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <span className="text-lg font-semibold">SilverCare</span>
            </div>
            <p className="text-gray-400">
              © 2024 SilverCare. 고령자의 행복한 삶을 위해.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
