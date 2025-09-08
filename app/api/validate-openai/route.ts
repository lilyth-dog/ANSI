import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // OpenAI API 키 유효성 검증
    const isValid = await validateOpenAiApiKey(apiKey);

    if (isValid) {
      return NextResponse.json(
        { 
          valid: true, 
          message: 'OpenAI API 키가 유효합니다.' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          valid: false, 
          message: 'OpenAI API 키가 유효하지 않습니다.' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('OpenAI API 키 검증 오류:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'API 키 검증 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

async function validateOpenAiApiKey(apiKey: string): Promise<boolean> {
  try {
    // OpenAI API 키 형식 검증
    if (!apiKey.startsWith('sk-')) {
      return false;
    }

    // 실제 OpenAI API에 모델 목록 요청을 보내서 검증
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // 모델 목록이 반환되면 유효한 API 키
      return Array.isArray(data.data) && data.data.length > 0;
    }

    return false;
  } catch (error) {
    console.error('OpenAI API 키 검증 실패:', error);
    return false;
  }
}