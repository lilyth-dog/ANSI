import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Less whitespace, more content density */}
      <section className="relative py-16 lg:py-24">
        <div className="container-patent">
          <div className="max-w-6xl mx-auto">

            {/* Top Section - Logo and CTA */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">PatentAI</h2>
                  <p className="text-sm text-gray-600">AI 기반 특허 플랫폼</p>
                </div>
              </div>

              {/* Better CTA Button */}
              <Link href="/patents/search">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base">
                  <Search className="mr-2 h-5 w-5" />
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left Column - Copy */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  특허 업무 자동화 플랫폼
                </div>

                {/* Headline */}
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  특허 검색하고<br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                    AI가 초안 작성
                  </span>
                </h1>

                {/* Value Proposition */}
                <p className="text-xl text-gray-600 leading-relaxed">
                  특허를 검색하고 AI가 자동으로 특허 초안을 생성합니다.<br />
                  복잡한 특허 업무를 <span className="font-semibold text-gray-900">90% 단축</span>하세요.
                </p>

                {/* Key Benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">실시간 특허 데이터 검색</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">AI 자동 초안 생성</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">무료로 즉시 사용 가능</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Link href="/patents/search">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold">
                      <Search className="mr-2 h-6 w-6" />
                      지금 무료로 시작하기
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">특허 검색</h3>
                        <p className="text-sm text-gray-600">실시간 데이터 조회</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI 초안 생성</h3>
                        <p className="text-sm text-gray-600">자동 문서 작성</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-green-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-green-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-green-200 rounded animate-pulse w-4/6"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}