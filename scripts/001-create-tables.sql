-- 고령자 정보 테이블
CREATE TABLE IF NOT EXISTS elderly_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    emergency_contact VARCHAR(20),
    medical_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 통화 기록 테이블
CREATE TABLE IF NOT EXISTS call_records (
    id SERIAL PRIMARY KEY,
    elderly_user_id INTEGER REFERENCES elderly_users(id) ON DELETE CASCADE,
    call_date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL, -- 초 단위
    transcript TEXT,
    audio_file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 감정 분석 결과 테이블
CREATE TABLE IF NOT EXISTS emotion_analysis (
    id SERIAL PRIMARY KEY,
    call_record_id INTEGER REFERENCES call_records(id) ON DELETE CASCADE,
    happiness_score DECIMAL(3,2) DEFAULT 0,
    sadness_score DECIMAL(3,2) DEFAULT 0,
    anger_score DECIMAL(3,2) DEFAULT 0,
    fear_score DECIMAL(3,2) DEFAULT 0,
    surprise_score DECIMAL(3,2) DEFAULT 0,
    overall_sentiment VARCHAR(20) NOT NULL, -- positive, negative, neutral
    confidence_score DECIMAL(3,2) NOT NULL,
    keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    elderly_user_id INTEGER REFERENCES elderly_users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- emotional_distress, emergency, health_concern
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
