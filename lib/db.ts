// 실제 프로덕션에서는 적절한 데이터베이스 연결을 사용하세요
// 이 예제는 시뮬레이션된 데이터를 사용합니다

import type { ElderlyUser, CallRecord, EmotionAnalysis, Alert, DashboardStats } from "@/types"

// 시뮬레이션된 데이터
const mockElderlyUsers: ElderlyUser[] = [
  {
    id: 1,
    name: "김영희",
    age: 75,
    phone: "010-1234-5678",
    emergency_contact: "010-9876-5432",
    medical_conditions: "고혈압, 당뇨",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "박철수",
    age: 82,
    phone: "010-2345-6789",
    emergency_contact: "010-8765-4321",
    medical_conditions: "관절염",
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  },
  {
    id: 3,
    name: "이순자",
    age: 68,
    phone: "010-3456-7890",
    emergency_contact: "010-7654-3210",
    medical_conditions: "없음",
    created_at: "2024-01-17T10:00:00Z",
    updated_at: "2024-01-17T10:00:00Z",
  },
]

const mockCallRecords: CallRecord[] = [
  {
    id: 1,
    elderly_user_id: 1,
    call_date: "2024-01-19T14:30:00Z",
    duration: 180,
    transcript: "안녕하세요. 오늘 기분이 좀 우울해요. 자식들이 바빠서 연락도 잘 안 되고...",
    created_at: "2024-01-19T14:30:00Z",
  },
  {
    id: 2,
    elderly_user_id: 1,
    call_date: "2024-01-18T15:00:00Z",
    duration: 240,
    transcript: "병원에 다녀왔는데 검사 결과가 좋아졌다고 하네요. 기분이 좋아요.",
    created_at: "2024-01-18T15:00:00Z",
  },
  {
    id: 3,
    elderly_user_id: 2,
    call_date: "2024-01-19T16:00:00Z",
    duration: 150,
    transcript: "무릎이 아파서 걷기가 힘들어요. 날씨가 추워서 더 아픈 것 같아요.",
    created_at: "2024-01-19T16:00:00Z",
  },
]

const mockEmotionAnalysis: EmotionAnalysis[] = [
  {
    id: 1,
    call_record_id: 1,
    happiness_score: 0.2,
    sadness_score: 0.7,
    anger_score: 0.1,
    fear_score: 0.3,
    surprise_score: 0.1,
    overall_sentiment: "negative",
    confidence_score: 0.85,
    keywords: ["우울", "외로움", "자식"],
    created_at: "2024-01-19T14:35:00Z",
  },
  {
    id: 2,
    call_record_id: 2,
    happiness_score: 0.8,
    sadness_score: 0.1,
    anger_score: 0.0,
    fear_score: 0.2,
    surprise_score: 0.3,
    overall_sentiment: "positive",
    confidence_score: 0.92,
    keywords: ["기쁨", "건강", "병원"],
    created_at: "2024-01-18T15:05:00Z",
  },
  {
    id: 3,
    call_record_id: 3,
    happiness_score: 0.3,
    sadness_score: 0.4,
    anger_score: 0.2,
    fear_score: 0.4,
    surprise_score: 0.1,
    overall_sentiment: "negative",
    confidence_score: 0.78,
    keywords: ["아픔", "날씨", "무릎"],
    created_at: "2024-01-19T16:05:00Z",
  },
]

const mockAlerts: Alert[] = [
  {
    id: 1,
    elderly_user_id: 1,
    alert_type: "emotional_distress",
    severity: "medium",
    message: "김영희님이 지속적으로 우울감을 호소하고 있습니다.",
    is_resolved: false,
    created_at: "2024-01-19T14:40:00Z",
  },
  {
    id: 2,
    elderly_user_id: 2,
    alert_type: "health_concern",
    severity: "low",
    message: "박철수님이 관절 통증을 자주 언급하고 있습니다.",
    is_resolved: false,
    created_at: "2024-01-19T16:10:00Z",
  },
]

export function getElderlyUsers(): ElderlyUser[] {
  // 실제 데이터베이스 쿼리로 대체
  return mockElderlyUsers
}

export function getCallRecords(): CallRecord[] {
  return mockCallRecords.map((record) => ({
    ...record,
    elderly_user: mockElderlyUsers.find((user) => user.id === record.elderly_user_id),
  }))
}

export function getEmotionAnalysis(): EmotionAnalysis[] {
  return mockEmotionAnalysis.map((analysis) => ({
    ...analysis,
    call_record: mockCallRecords.find((record) => record.id === analysis.call_record_id),
  }))
}

export function getAlerts(): Alert[] {
  return mockAlerts.map((alert) => ({
    ...alert,
    elderly_user: mockElderlyUsers.find((user) => user.id === alert.elderly_user_id),
  }))
}

export function getDashboardStats(): DashboardStats {
  const totalUsers = mockElderlyUsers.length
  const totalCalls = mockCallRecords.length
  const activeAlerts = mockAlerts.filter((alert) => !alert.is_resolved).length
  const averageSentiment =
    mockEmotionAnalysis.reduce((sum, analysis) => {
      return sum + (analysis.overall_sentiment === "positive" ? 1 : analysis.overall_sentiment === "negative" ? -1 : 0)
    }, 0) / mockEmotionAnalysis.length

  return {
    totalUsers,
    totalCalls,
    activeAlerts,
    averageSentiment,
  }
}
