export type UserRole = "ADMIN" | "COUNSELOR" | "PROTECTOR" | "SENIOR"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  profileImage?: string
  phoneNumber?: string
}

export interface ElderlyUser {
  id: number
  name: string
  age: number
  phone: string
  emergency_contact?: string
  medical_conditions?: string
  created_at: string
  updated_at: string
}

export interface CallRecord {
  id: number
  elderly_user_id: number
  call_date: string
  duration: number
  transcript?: string
  audio_file_url?: string
  created_at: string
  elderly_user?: ElderlyUser
}

export interface EmotionAnalysis {
  id: number
  call_record_id: number
  happiness_score: number
  sadness_score: number
  anger_score: number
  fear_score: number
  surprise_score: number
  overall_sentiment: "positive" | "negative" | "neutral"
  confidence_score: number
  keywords: string[]
  created_at: string
  call_record?: CallRecord
}

export interface Alert {
  id: number
  elderly_user_id: number
  alert_type: "emotional_distress" | "emergency" | "health_concern"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  is_resolved: boolean
  created_at: string
  resolved_at?: string
  elderly_user?: ElderlyUser
}

export interface DashboardStats {
  totalUsers: number
  totalCalls: number
  activeAlerts: number
  averageSentiment: number
}

// 새로운 타입들 추가
export interface Senior {
  id: string
  name: string
  age: number
  phoneNumber: string
  emergencyContact: string
  medicalConditions?: string[]
  protectorIds: string[]
  counselorId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CounselingNote {
  id: string
  seniorId: string
  counselorId: string
  content: string
  interventionSuggestions?: string[]
  followUpDate?: Date
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}

export interface MoodEntry {
  id: string
  seniorId: string
  mood: "very_happy" | "happy" | "neutral" | "sad" | "very_sad"
  notes?: string
  createdAt: Date
}
