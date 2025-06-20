import type {
  User,
  Senior,
  CallRecord,
  EmotionAnalysis,
  CounselingNote,
  Alert,
  MoodEntry,
  DashboardStats,
} from "@/types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@silvercare.com",
    name: "시스템 관리자",
    role: "ADMIN",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    profileImage: "/placeholder.svg?height=40&width=40",
    phoneNumber: "010-1234-5678",
  },
  {
    id: "counselor-1",
    email: "counselor@silvercare.com",
    name: "김상담",
    role: "COUNSELOR",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    profileImage: "/placeholder.svg?height=40&width=40",
    phoneNumber: "010-2345-6789",
  },
  {
    id: "protector-1",
    email: "protector@silvercare.com",
    name: "이보호",
    role: "PROTECTOR",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    profileImage: "/placeholder.svg?height=40&width=40",
    phoneNumber: "010-3456-7890",
  },
  {
    id: "senior-1",
    email: "senior@silvercare.com",
    name: "박어르신",
    role: "SENIOR",
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
    profileImage: "/placeholder.svg?height=40&width=40",
    phoneNumber: "010-4567-8901",
  },
]

// Mock Seniors
export const mockSeniors: Senior[] = [
  {
    id: "senior-1",
    name: "김영희",
    age: 75,
    phoneNumber: "010-1111-2222",
    emergencyContact: "010-9999-8888",
    medicalConditions: ["고혈압", "당뇨병"],
    protectorIds: ["protector-1"],
    counselorId: "counselor-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "senior-2",
    name: "박철수",
    age: 82,
    phoneNumber: "010-2222-3333",
    emergencyContact: "010-8888-7777",
    medicalConditions: ["관절염"],
    protectorIds: ["protector-1"],
    counselorId: "counselor-1",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "senior-3",
    name: "이순자",
    age: 68,
    phoneNumber: "010-3333-4444",
    emergencyContact: "010-7777-6666",
    medicalConditions: [],
    protectorIds: ["protector-1"],
    counselorId: "counselor-1",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "senior-4",
    name: "최만수",
    age: 79,
    phoneNumber: "010-4444-5555",
    emergencyContact: "010-6666-5555",
    medicalConditions: ["심장병", "고혈압"],
    protectorIds: ["protector-1"],
    counselorId: "counselor-1",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
]

// Mock Call Records
export const mockCallRecords: CallRecord[] = [
  {
    id: "call-1",
    seniorId: "senior-1",
    duration: 180,
    timestamp: new Date("2024-01-20T14:30:00"),
    transcript: "안녕하세요. 오늘 기분이 좀 우울해요. 자식들이 바빠서 연락도 잘 안 되고... 혼자 있으니까 외로워요.",
    audioUrl: "/audio/call-1.mp3",
    createdAt: new Date("2024-01-20T14:30:00"),
  },
  {
    id: "call-2",
    seniorId: "senior-1",
    duration: 240,
    timestamp: new Date("2024-01-19T15:00:00"),
    transcript: "병원에 다녀왔는데 검사 결과가 좋아졌다고 하네요. 기분이 좋아요. 의사 선생님이 칭찬해주셔서 기뻤어요.",
    audioUrl: "/audio/call-2.mp3",
    createdAt: new Date("2024-01-19T15:00:00"),
  },
  {
    id: "call-3",
    seniorId: "senior-2",
    duration: 150,
    timestamp: new Date("2024-01-20T16:00:00"),
    transcript: "무릎이 아파서 걷기가 힘들어요. 날씨가 추워서 더 아픈 것 같아요. 병원에 가야 할까요?",
    audioUrl: "/audio/call-3.mp3",
    createdAt: new Date("2024-01-20T16:00:00"),
  },
  {
    id: "call-4",
    seniorId: "senior-3",
    duration: 200,
    timestamp: new Date("2024-01-20T10:00:00"),
    transcript: "손자가 놀러 와서 정말 행복했어요. 오랜만에 웃었네요. 아이들과 함께 있으니까 활력이 생겨요.",
    audioUrl: "/audio/call-4.mp3",
    createdAt: new Date("2024-01-20T10:00:00"),
  },
]

// Mock Emotion Analysis
export const mockEmotionAnalysis: EmotionAnalysis[] = [
  {
    id: "emotion-1",
    callRecordId: "call-1",
    happiness: 0.2,
    sadness: 0.7,
    anger: 0.1,
    fear: 0.3,
    surprise: 0.1,
    neutral: 0.1,
    overallSentiment: "negative",
    confidenceScore: 0.85,
    keywords: ["우울", "외로움", "자식", "혼자"],
    riskLevel: "medium",
    createdAt: new Date("2024-01-20T14:35:00"),
  },
  {
    id: "emotion-2",
    callRecordId: "call-2",
    happiness: 0.8,
    sadness: 0.1,
    anger: 0.0,
    fear: 0.1,
    surprise: 0.3,
    neutral: 0.2,
    overallSentiment: "positive",
    confidenceScore: 0.92,
    keywords: ["기쁨", "건강", "병원", "칭찬"],
    riskLevel: "low",
    createdAt: new Date("2024-01-19T15:05:00"),
  },
  {
    id: "emotion-3",
    callRecordId: "call-3",
    happiness: 0.1,
    sadness: 0.4,
    anger: 0.2,
    fear: 0.4,
    surprise: 0.1,
    neutral: 0.2,
    overallSentiment: "negative",
    confidenceScore: 0.78,
    keywords: ["아픔", "날씨", "무릎", "병원"],
    riskLevel: "medium",
    createdAt: new Date("2024-01-20T16:05:00"),
  },
  {
    id: "emotion-4",
    callRecordId: "call-4",
    happiness: 0.9,
    sadness: 0.1,
    anger: 0.0,
    fear: 0.0,
    surprise: 0.4,
    neutral: 0.1,
    overallSentiment: "positive",
    confidenceScore: 0.95,
    keywords: ["행복", "손자", "가족", "활력"],
    riskLevel: "low",
    createdAt: new Date("2024-01-20T10:05:00"),
  },
]

// Mock Counseling Notes
export const mockCounselingNotes: CounselingNote[] = [
  {
    id: "note-1",
    seniorId: "senior-1",
    counselorId: "counselor-1",
    content:
      "김영희님이 지속적으로 외로움을 호소하고 있습니다. 가족과의 연락 빈도를 늘리고, 지역 사회 활동 참여를 권장할 필요가 있습니다.",
    interventionSuggestions: ["가족 연락 일정 수립", "지역 노인회관 프로그램 안내", "정기적인 상담 일정 조정"],
    followUpDate: new Date("2024-01-25"),
    priority: "medium",
    createdAt: new Date("2024-01-20T17:00:00"),
    updatedAt: new Date("2024-01-20T17:00:00"),
  },
  {
    id: "note-2",
    seniorId: "senior-2",
    counselorId: "counselor-1",
    content: "박철수님의 관절 통증이 심화되고 있어 일상생활에 지장을 주고 있습니다. 의료진과의 상담이 필요합니다.",
    interventionSuggestions: ["정형외과 전문의 진료 예약", "물리치료 프로그램 안내", "통증 관리 교육"],
    followUpDate: new Date("2024-01-23"),
    priority: "high",
    createdAt: new Date("2024-01-20T17:30:00"),
    updatedAt: new Date("2024-01-20T17:30:00"),
  },
]

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    seniorId: "senior-1",
    type: "emotional_distress",
    severity: "medium",
    message: "김영희님이 지속적으로 우울감과 외로움을 호소하고 있습니다. 상담이 필요합니다.",
    isResolved: false,
    createdAt: new Date("2024-01-20T14:40:00"),
  },
  {
    id: "alert-2",
    seniorId: "senior-2",
    type: "health_concern",
    severity: "high",
    message: "박철수님이 관절 통증을 자주 언급하고 있습니다. 의료진 상담이 필요합니다.",
    isResolved: false,
    createdAt: new Date("2024-01-20T16:10:00"),
  },
  {
    id: "alert-3",
    seniorId: "senior-3",
    type: "missed_call",
    severity: "low",
    message: "이순자님이 예정된 통화 시간에 응답하지 않았습니다.",
    isResolved: true,
    resolvedBy: "counselor-1",
    resolvedAt: new Date("2024-01-19T11:00:00"),
    createdAt: new Date("2024-01-19T10:30:00"),
  },
]

// Mock Mood Entries
export const mockMoodEntries: MoodEntry[] = [
  {
    id: "mood-1",
    seniorId: "senior-1",
    mood: "sad",
    notes: "오늘은 기분이 좀 우울해요. 날씨가 흐려서 그런가 봐요.",
    createdAt: new Date("2024-01-20T09:00:00"),
  },
  {
    id: "mood-2",
    seniorId: "senior-1",
    mood: "happy",
    notes: "손자 사진을 보니까 기분이 좋아졌어요.",
    createdAt: new Date("2024-01-19T14:00:00"),
  },
  {
    id: "mood-3",
    seniorId: "senior-3",
    mood: "very_happy",
    notes: "손자가 놀러 와서 정말 행복한 하루였어요!",
    createdAt: new Date("2024-01-20T20:00:00"),
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalSeniors: mockSeniors.length,
  totalCalls: mockCallRecords.length,
  activeAlerts: mockAlerts.filter((alert) => !alert.isResolved).length,
  averageSentiment: 0.3, // Calculated from emotion analysis
  callsToday: mockCallRecords.filter((call) => {
    const today = new Date()
    const callDate = new Date(call.timestamp)
    return callDate.toDateString() === today.toDateString()
  }).length,
  alertsToday: mockAlerts.filter((alert) => {
    const today = new Date()
    const alertDate = new Date(alert.createdAt)
    return alertDate.toDateString() === today.toDateString()
  }).length,
}

// Helper functions to get related data
export function getSeniorById(id: string): Senior | undefined {
  return mockSeniors.find((senior) => senior.id === id)
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

export function getCallRecordsBySeniorId(seniorId: string): CallRecord[] {
  return mockCallRecords.filter((call) => call.seniorId === seniorId)
}

export function getEmotionAnalysisByCallId(callId: string): EmotionAnalysis | undefined {
  return mockEmotionAnalysis.find((emotion) => emotion.callRecordId === callId)
}

export function getCounselingNotesBySeniorId(seniorId: string): CounselingNote[] {
  return mockCounselingNotes.filter((note) => note.seniorId === seniorId)
}

export function getAlertsBySeniorId(seniorId: string): Alert[] {
  return mockAlerts.filter((alert) => alert.seniorId === seniorId)
}

export function getMoodEntriesBySeniorId(seniorId: string): MoodEntry[] {
  return mockMoodEntries.filter((mood) => mood.seniorId === seniorId)
}

export function getRecentCallRecords(limit = 5): CallRecord[] {
  return mockCallRecords
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export function getRecentAlerts(limit = 5): Alert[] {
  return mockAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export function getActiveAlerts(): Alert[] {
  return mockAlerts.filter((alert) => !alert.isResolved)
}

export function getCriticalAlerts(): Alert[] {
  return mockAlerts.filter((alert) => !alert.isResolved && alert.severity === "critical")
}

export function getHighRiskSeniors(): Senior[] {
  const highRiskSeniorIds = mockEmotionAnalysis
    .filter((emotion) => emotion.riskLevel === "high" || emotion.riskLevel === "critical")
    .map((emotion) => {
      const callRecord = mockCallRecords.find((call) => call.id === emotion.callRecordId)
      return callRecord?.seniorId
    })
    .filter(Boolean) as string[]

  return mockSeniors.filter((senior) => highRiskSeniorIds.includes(senior.id))
}
