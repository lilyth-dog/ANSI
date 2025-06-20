// 클라이언트 사이드 Firebase만 유지 (Admin 제거)
import { initializeApp, getApps, getApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Initialize Firebase (클라이언트 사이드만)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export default app

// Firestore collections (참조용)
export const COLLECTIONS = {
  USERS: "users",
  SENIORS: "seniors",
  CALL_RECORDS: "callRecords",
  EMOTION_ANALYSIS: "emotionAnalysis",
  COUNSELING_NOTES: "counselingNotes",
  ALERTS: "alerts",
  MOOD_ENTRIES: "moodEntries",
} as const

// 헬퍼 함수들 (실제 구현은 나중에)
export async function createDocument(collection: string, data: any, id?: string) {
  console.log(`Creating document in ${collection}:`, data)
  return Promise.resolve({ id: id || "mock-id" })
}

export async function getDocument(collection: string, id: string) {
  console.log(`Getting document from ${collection}:`, id)
  return Promise.resolve(null)
}

export async function updateDocument(collection: string, id: string, data: any) {
  console.log(`Updating document in ${collection}:`, id, data)
  return Promise.resolve()
}

export async function deleteDocument(collection: string, id: string) {
  console.log(`Deleting document from ${collection}:`, id)
  return Promise.resolve()
}

export async function getCollection(collection: string, conditions?: any[]) {
  console.log(`Getting collection ${collection} with conditions:`, conditions)
  return Promise.resolve([])
}
