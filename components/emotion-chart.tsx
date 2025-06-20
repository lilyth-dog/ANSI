"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmotionAnalysis } from "@/types"

interface EmotionChartProps {
  data: EmotionAnalysis[]
}

export function EmotionChart({ data }: EmotionChartProps) {
  const emotions = ["happiness", "sadness", "anger", "fear", "surprise"] as const
  const emotionLabels = {
    happiness: "행복",
    sadness: "슬픔",
    anger: "분노",
    fear: "두려움",
    surprise: "놀라움",
  }

  const emotionColors = {
    happiness: "bg-yellow-400",
    sadness: "bg-blue-400",
    anger: "bg-red-400",
    fear: "bg-purple-400",
    surprise: "bg-green-400",
  }

  const averageEmotions = emotions.reduce(
    (acc, emotion) => {
      const key = `${emotion}_score` as keyof EmotionAnalysis
      const average = data.reduce((sum, analysis) => sum + (analysis[key] as number), 0) / data.length
      acc[emotion] = average
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>평균 감정 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div key={emotion} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-600">{emotionLabels[emotion]}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${emotionColors[emotion]}`}
                  style={{ width: `${averageEmotions[emotion] * 100}%` }}
                />
              </div>
              <div className="w-12 text-sm text-gray-500 text-right">
                {(averageEmotions[emotion] * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
