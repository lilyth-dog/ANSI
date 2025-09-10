import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PatentAI - AI 기반 특허 컨설팅 플랫폼',
  description: 'KIPRIS API를 활용한 특허 정보 색인 및 신규 스타트업의 초기 시장 진입을 위한 AI 기반 컨설팅 서비스',
  keywords: '특허, 컨설팅, AI, KIPRIS, 스타트업, 특허 분석, 특허 전략',
  authors: [{ name: 'PatentAI Team' }],
  openGraph: {
    title: 'PatentAI - AI 기반 특허 컨설팅 플랫폼',
    description: 'KIPRIS API를 활용한 특허 정보 색인 및 신규 스타트업의 초기 시장 진입을 위한 AI 기반 컨설팅 서비스',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            <Navigation />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
