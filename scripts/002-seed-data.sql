-- 샘플 고령자 데이터
INSERT INTO elderly_users (name, age, phone, emergency_contact, medical_conditions) VALUES
('김영희', 75, '010-1234-5678', '010-9876-5432', '고혈압, 당뇨'),
('박철수', 82, '010-2345-6789', '010-8765-4321', '관절염'),
('이순자', 68, '010-3456-7890', '010-7654-3210', '없음'),
('최만수', 79, '010-4567-8901', '010-6543-2109', '심장병');

-- 샘플 통화 기록
INSERT INTO call_records (elderly_user_id, call_date, duration, transcript) VALUES
(1, NOW() - INTERVAL '1 day', 180, '안녕하세요. 오늘 기분이 좀 우울해요. 자식들이 바빠서 연락도 잘 안 되고...'),
(1, NOW() - INTERVAL '2 days', 240, '병원에 다녀왔는데 검사 결과가 좋아졌다고 하네요. 기분이 좋아요.'),
(2, NOW() - INTERVAL '1 day', 150, '무릎이 아파서 걷기가 힘들어요. 날씨가 추워서 더 아픈 것 같아요.'),
(3, NOW() - INTERVAL '3 hours', 200, '손자가 놀러 와서 정말 행복했어요. 오랜만에 웃었네요.');

-- 샘플 감정 분석 결과
INSERT INTO emotion_analysis (call_record_id, happiness_score, sadness_score, anger_score, fear_score, surprise_score, overall_sentiment, confidence_score, keywords) VALUES
(1, 0.2, 0.7, 0.1, 0.3, 0.1, 'negative', 0.85, ARRAY['우울', '외로움', '자식']),
(2, 0.8, 0.1, 0.0, 0.2, 0.3, 'positive', 0.92, ARRAY['기쁨', '건강', '병원']),
(3, 0.3, 0.4, 0.2, 0.4, 0.1, 'negative', 0.78, ARRAY['아픔', '날씨', '무릎']),
(4, 0.9, 0.1, 0.0, 0.1, 0.4, 'positive', 0.95, ARRAY['행복', '손자', '가족']);

-- 샘플 알림
INSERT INTO alerts (elderly_user_id, alert_type, severity, message) VALUES
(1, 'emotional_distress', 'medium', '김영희님이 지속적으로 우울감을 호소하고 있습니다.'),
(2, 'health_concern', 'low', '박철수님이 관절 통증을 자주 언급하고 있습니다.');
