import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, audioUrl } = body

    if (!text && !audioUrl) {
      return NextResponse.json({ error: "Text or audio URL is required" }, { status: 400 })
    }

    // 로그 기록 (콘솔로 대체)
    console.log("Emotion analysis requested", {
      hasText: !!text,
      hasAudio: !!audioUrl,
      textLength: text?.length || 0,
    })

    // 처리 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 텍스트 기반 감정 분석 모의 결과
    const mockAnalysis = generateMockEmotionAnalysis(text || "")

    console.log("Emotion analysis completed", {
      overallSentiment: mockAnalysis.overallSentiment,
      confidenceScore: mockAnalysis.confidenceScore,
      riskLevel: mockAnalysis.riskLevel,
    })

    return NextResponse.json({
      success: true,
      analysis: mockAnalysis,
    })
  } catch (error) {
    console.error("Emotion analysis failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateMockEmotionAnalysis(text: string) {
  // 간단한 키워드 기반 모의 분석
  const lowerText = text.toLowerCase()

  // 감정 키워드 정의
  const emotionKeywords = {
    happiness: ["기쁘", "행복", "좋", "웃", "즐거", "만족", "칭찬"],
    sadness: ["슬프", "우울", "외로", "혼자", "그리워", "눈물"],
    anger: ["화나", "짜증", "분노", "억울", "답답"],
    fear: ["무서", "걱정", "불안", "두려", "겁나"],
    surprise: ["놀라", "깜짝", "신기", "의외"],
  }

  // 키워드 존재 여부에 따른 감정 점수 계산
  const emotions = {
    happiness: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0.3, // 기본 중립 점수
  }

  // 키워드 매칭 수 계산
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const matches = keywords.filter((keyword) => lowerText.includes(keyword)).length
    emotions[emotion as keyof typeof emotions] = Math.min(matches * 0.3, 1.0)
  })

  // 점수 정규화
  const totalScore = Object.values(emotions).reduce((sum, score) => sum + score, 0)
  if (totalScore > 1) {
    Object.keys(emotions).forEach((key) => {
      emotions[key as keyof typeof emotions] /= totalScore
    })
  }

  // 전반적 감정 결정
  const { happiness, sadness, anger, fear } = emotions
  let overallSentiment: "positive" | "negative" | "neutral" = "neutral"

  if (happiness > 0.4) {
    overallSentiment = "positive"
  } else if (sadness > 0.4 || anger > 0.3 || fear > 0.3) {
    overallSentiment = "negative"
  }

  // 위험도 결정
  let riskLevel: "low" | "medium" | "high" | "critical" = "low"

  if (sadness > 0.6 || anger > 0.5 || fear > 0.5) {
    riskLevel = "high"
  } else if (sadness > 0.4 || anger > 0.3 || fear > 0.3) {
    riskLevel = "medium"
  }

  // 텍스트에서 키워드 추출
  const keywords = Object.entries(emotionKeywords)
    .flatMap(([, words]) => words.filter((word) => lowerText.includes(word)))
    .slice(0, 5) // 5개 키워드로 제한

  return {
    happiness: Number(emotions.happiness.toFixed(2)),
    sadness: Number(emotions.sadness.toFixed(2)),
    anger: Number(emotions.anger.toFixed(2)),
    fear: Number(emotions.fear.toFixed(2)),
    surprise: Number(emotions.surprise.toFixed(2)),
    neutral: Number(emotions.neutral.toFixed(2)),
    overallSentiment,
    confidenceScore: Number((0.7 + Math.random() * 0.25).toFixed(2)),
    keywords,
    riskLevel,
  }
}
