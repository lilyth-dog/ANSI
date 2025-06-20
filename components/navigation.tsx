"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Phone, AlertTriangle, Heart, Settings, LogOut } from "lucide-react"

const navigationItems = {
  ADMIN: [
    { name: "관리자 대시보드", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "사용자 관리", href: "/dashboard/admin/users", icon: Users },
    { name: "시스템 로그", href: "/dashboard/admin/logs", icon: Settings },
  ],
  COUNSELOR: [
    { name: "상담자 대시보드", href: "/dashboard/counselor", icon: LayoutDashboard },
    { name: "상담 기록", href: "/dashboard/counselor/notes", icon: Users },
    { name: "개입 제안", href: "/dashboard/counselor/interventions", icon: AlertTriangle },
  ],
  PROTECTOR: [
    { name: "보호자 대시보드", href: "/dashboard/protector", icon: LayoutDashboard },
    { name: "통화 기록", href: "/dashboard/protector/calls", icon: Phone },
    { name: "감정 추세", href: "/dashboard/protector/emotions", icon: Heart },
  ],
  SENIOR: [
    { name: "나의 대시보드", href: "/dashboard/senior", icon: LayoutDashboard },
    { name: "기분 기록", href: "/dashboard/senior/mood", icon: Heart },
    { name: "통화하기", href: "/dashboard/senior/call", icon: Phone },
  ],
}

export function Navigation() {
  const { user, logout, switchRole } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const userNavItems = navigationItems[user.role] || []

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">SilverCare</h1>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">안녕하세요,</p>
          <p className="font-medium text-gray-900">{user.name}님</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>

        {/* Role Switcher for Demo */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">데모용 역할 전환:</p>
          <div className="grid grid-cols-2 gap-1">
            {(["ADMIN", "COUNSELOR", "PROTECTOR", "SENIOR"] as const).map((role) => (
              <Button
                key={role}
                variant={user.role === role ? "default" : "outline"}
                size="sm"
                onClick={() => switchRole(role)}
                className="text-xs"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        <ul className="space-y-2 mb-8">
          {userNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <Button variant="outline" onClick={logout} className="w-full flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </nav>
  )
}
