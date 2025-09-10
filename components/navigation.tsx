'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Users, FileText, BarChart3, Home, Settings, Key, Zap, Crown, LogIn, User, LogOut, UserCircle } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-patent">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">PatentAI</span>
              <span className="text-xs text-gray-500 -mt-1">AI 기반 특허 컨설팅</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

                 {/* Right Side Actions */}
                 <div className="flex items-center gap-3">
                   {isAuthenticated ? (
                     <>
                       {/* User Menu */}
                       <div className="relative">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="hidden sm:flex items-center gap-2"
                           onClick={() => setShowUserMenu(!showUserMenu)}
                         >
                           <UserCircle className="h-4 w-4" />
                           <span className="hidden md:inline">{user?.firstName} {user?.lastName}</span>
                         </Button>
                         
                         {showUserMenu && (
                           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                             <div className="py-1">
                               <div className="px-4 py-2 border-b border-gray-100">
                                 <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                                 <p className="text-xs text-gray-500">{user?.email}</p>
                                 <p className="text-xs text-blue-600 font-medium mt-1">
                                   {user?.subscription.tier === 'free' ? '기본 플랜' : 
                                    user?.subscription.tier === 'premium' ? '프리미엄 플랜' : '엔터프라이즈 플랜'}
                                 </p>
                               </div>
                               <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                 대시보드
                               </Link>
                               <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                 설정
                               </Link>
                               <Link href="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                 플랜 관리
                               </Link>
                               <div className="border-t border-gray-100">
                                 <button
                                   onClick={() => {
                                     logout();
                                     setShowUserMenu(false);
                                   }}
                                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                 >
                                   <LogOut className="h-4 w-4 inline mr-2" />
                                   로그아웃
                                 </button>
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                       
                       <Link href="/pricing">
                         <Button variant="outline" size="sm" className="hidden sm:flex">
                           <Crown className="h-4 w-4 mr-2" />
                           프리미엄
                         </Button>
                       </Link>
                     </>
                   ) : (
                     <>
                       <Link href="/auth/login">
                         <Button variant="ghost" size="sm" className="hidden sm:flex">
                           <LogIn className="h-4 w-4 mr-2" />
                           로그인
                         </Button>
                       </Link>
                       
                       <Link href="/auth/register">
                         <Button variant="outline" size="sm" className="hidden sm:flex">
                           <User className="h-4 w-4 mr-2" />
                           회원가입
                         </Button>
                       </Link>
                       
                       <Link href="/pricing">
                         <Button variant="outline" size="sm" className="hidden sm:flex">
                           <Crown className="h-4 w-4 mr-2" />
                           프리미엄
                         </Button>
                       </Link>
                     </>
                   )}
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="lg:hidden">
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
