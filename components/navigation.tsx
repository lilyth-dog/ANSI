'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowRight, BarChart3, TrendingUp, Users, Key, Settings, LogIn, User, Crown, UserCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigation = [
    { name: '홈', href: '/', icon: Home },
    { name: '대시보드', href: '/dashboard', icon: BarChart3 },
    { name: '특허 검색', href: '/patents/search', icon: Search },
    { name: 'AI 분석', href: '/analysis', icon: TrendingUp },
    { name: '컨설팅', href: '/consulting', icon: Users },
    { name: 'API 키', href: '/api-keys', icon: Key },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-white/20 shadow-xl">
      <div className="container-patent">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">PatentAI</span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">AI 기반 특허 플랫폼</span>
            </div>
          </Link>

          {/* Premium Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 border-0'
                      : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-lg border-0'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-gray-600'}`} />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden md:inline font-medium">{user?.firstName} {user?.lastName}</span>
                  </Button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 px-2 py-1 rounded-full inline-block">
                          프리미엄 플랜
                        </p>
                      </div>
                      <div className="py-2">
                        <Link href="/dashboard" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                          <BarChart3 className="h-4 w-4 inline mr-3" />
                          대시보드
                        </Link>
                        <Link href="/settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                          <Settings className="h-4 w-4 inline mr-3" />
                          설정
                        </Link>
                        <Link href="/pricing" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                          <Crown className="h-4 w-4 inline mr-3" />
                          플랜 관리
                        </Link>
                        <div className="border-t border-gray-100 mt-2">
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                          >
                            로그아웃
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="hidden sm:flex border-white/30 text-white hover:bg-white hover:text-blue-600 rounded-xl px-4 py-2 backdrop-blur-sm">
                    <Crown className="h-4 w-4 mr-2" />
                    프리미엄
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-white hover:bg-white/10 rounded-xl px-4 py-2">
                    <LogIn className="h-4 w-4 mr-2" />
                    로그인
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button variant="outline" size="sm" className="hidden sm:flex border-white/30 text-white hover:bg-white hover:text-blue-600 rounded-xl px-4 py-2 backdrop-blur-sm">
                    <User className="h-4 w-4 mr-2" />
                    회원가입
                  </Button>
                </Link>

                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="hidden sm:flex border-white/30 text-white hover:bg-white hover:text-blue-600 rounded-xl px-4 py-2 backdrop-blur-sm">
                    <Crown className="h-4 w-4 mr-2" />
                    프리미엄
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-white/10">
              <span className="sr-only">메뉴 열기</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
