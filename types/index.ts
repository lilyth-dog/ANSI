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

// 특허 정보 관련 타입
export interface Patent {
  id: string;
  title: string;
  abstract: string;
  inventors: string[];
  applicants: string[];
  applicationDate: string;
  publicationDate: string;
  status: PatentStatus;
  classification: string[];
  claims: string[];
  description: string;
  drawings: string[];
  legalStatus: string;
  citations: string[];
  familyPatents: string[];
}

export enum PatentStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  GRANTED = 'granted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum LegalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LITIGATION = 'litigation',
  LICENSED = 'licensed'
}

// 스타트업 정보 타입
export interface Startup {
  id: string;
  name: string;
  industry: string;
  description: string;
  foundedDate: string;
  teamSize: number;
  fundingStage: FundingStage;
  businessModel: string;
  targetMarket: string;
  competitors: string[];
  patents: string[];
  marketAnalysis: MarketAnalysis;
}

export enum FundingStage {
  IDEA = 'idea',
  SEED = 'seed',
  SERIES_A = 'series_a',
  SERIES_B = 'series_b',
  SERIES_C = 'series_c',
  IPO = 'ipo'
}

export interface MarketAnalysis {
  marketSize: number;
  growthRate: number;
  barriers: string[];
  opportunities: string[];
  threats: string[];
  competitiveAdvantage: string[];
}

// KIPRIS API 응답 타입
export interface KiprisResponse {
  success: boolean;
  data: Patent[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface KiprisSearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  classification?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: PatentStatus[];
}

// AI 분석 결과 타입
export interface PatentAnalysis {
  patentId: string;
  novelty: number;
  inventiveness: number;
  industrialApplicability: number;
  marketPotential: number;
  riskAssessment: RiskAssessment;
  recommendations: string[];
  competitiveLandscape: CompetitiveLandscape;
}

export interface RiskAssessment {
  infringementRisk: number;
  validityRisk: number;
  enforcementRisk: number;
  overallRisk: number;
  riskFactors: string[];
}

export interface CompetitiveLandscape {
  directCompetitors: string[];
  indirectCompetitors: string[];
  marketPosition: string;
  differentiationOpportunities: string[];
}

// 컨설팅 리포트 타입
export interface ConsultingReport {
  id: string;
  startupId: string;
  createdAt: string;
  executiveSummary: string;
  marketAnalysis: MarketAnalysis;
  patentStrategy: PatentStrategy;
  riskMitigation: RiskMitigation;
  recommendations: Recommendation[];
  timeline: Timeline[];
}

export interface PatentStrategy {
  filingStrategy: string;
  geographicCoverage: string[];
  technologyFocus: string[];
  budgetEstimate: number;
  priorityAreas: string[];
}

export interface RiskMitigation {
  risks: Risk[];
  mitigationStrategies: string[];
  contingencyPlans: string[];
}

export interface Risk {
  type: string;
  probability: number;
  impact: number;
  description: string;
}

export interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  timeline: string;
}

export interface Timeline {
  phase: string;
  duration: string;
  milestones: string[];
  deliverables: string[];
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  startups: string[];
  createdAt: string;
}

export enum UserRole {
  STARTUP_OWNER = 'startup_owner',
  CONSULTANT = 'consultant',
  INVESTOR = 'investor',
  ADMIN = 'admin'
}

// 검색 및 필터링 타입
export interface SearchFilters {
  industry: string[];
  technology: string[];
  dateRange: {
    from: string;
    to: string;
  };
  patentStatus: PatentStatus[];
  fundingStage: FundingStage[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 로컬 스토리지 관련 타입
export interface SearchHistory {
  id: string;
  query: string;
  results: Patent[];
  resultCount: number;
  timestamp: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en' | 'ja';
  notifications: {
    email: boolean;
    browser: boolean;
    analysisComplete: boolean;
    newRecommendations: boolean;
  };
  display: {
    resultsPerPage: number;
    showAbstracts: boolean;
    showCitations: boolean;
    defaultSort: 'relevance' | 'date' | 'title';
  };
  analysis: {
    defaultModel: string;
    autoSave: boolean;
    includeRiskAssessment: boolean;
    includeCompetitiveAnalysis: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FavoritePatent {
  id: string;
  patentId: string;
  patent: Patent;
  notes?: string;
  tags?: string[];
  timestamp: string;
}

export interface AnalysisHistory {
  id: string;
  patentId: string;
  analysis: PatentAnalysis;
  status: 'completed' | 'failed' | 'in_progress';
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ExportData {
  searchHistory: SearchHistory[];
  patentAnalysis: AnalysisHistory[];
  consultingReports: any[];
  favoritePatents: FavoritePatent[];
  exportDate: string;
  version: string;
}

// 웹 검색 관련 타입
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedDate?: string;
  relevance: number;
}

export interface WebSearchParams {
  query: string;
  maxResults?: number;
  sources?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

// RAG 관련 타입
export interface RAGQuery {
  question: string;
  context?: {
    patents?: Patent[];
    webResults?: WebSearchResult[];
    additionalInfo?: string;
  };
  maxTokens?: number;
  temperature?: number;
}

export interface RAGResponse {
  answer: string;
  sources: {
    patents: Patent[];
    webResults: WebSearchResult[];
    confidence: number;
  };
  reasoning: string;
  followUpQuestions: string[];
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: 'patent' | 'web' | 'manual';
    relevance: number;
    timestamp: string;
  };
  embedding?: number[];
}

// 클러스터링 관련 타입
export interface PatentVector {
  patentId: string;
  vector: number[];
  metadata: {
    title: string;
    abstract: string;
    classification: string[];
    inventors: string[];
    applicants: string[];
  };
}

export interface ClusteringResult {
  clusters: PatentCluster[];
  pcaData: PCAResult;
  similarityMatrix: number[][];
  metadata: {
    totalPatents: number;
    totalClusters: number;
    averageClusterSize: number;
    silhouetteScore: number;
  };
}

export interface PatentCluster {
  id: string;
  patents: Patent[];
  centroid: number[];
  keywords: string[];
  size: number;
  cohesion: number;
  description: string;
}

export interface PCAResult {
  components: number[][];
  explainedVariance: number[];
  cumulativeVariance: number[];
  transformedData: number[][];
}

// 시장 분석 관련 타입
export interface MarketTrend {
  period: string;
  growthRate: number;
  marketSize: number;
  keyDrivers: string[];
  challenges: string[];
}

export interface CompetitiveAnalysis {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  marketPosition: string;
  competitiveAdvantages: string[];
  threats: string[];
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  patents: Patent[];
  funding: FundingStage;
}

export interface MarketOpportunity {
  area: string;
  potential: number; // 1-10
  barriers: string[];
  entryStrategies: string[];
  estimatedInvestment: number;
  timeline: string;
}

export interface MarketReport {
  summary: string;
  marketSize: MarketSize;
  trends: MarketTrend[];
  competitiveAnalysis: CompetitiveAnalysis;
  opportunities: MarketOpportunity[];
  recommendations: string[];
  riskFactors: string[];
  timeline: string;
}

export interface MarketSize {
  current: number;
  projected: number;
  growthRate: number;
  unit: string;
  source: string;
}

// 시뮬레이션 관련 타입
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
  results: SimulationResults;
}

export interface SimulationParameters {
  marketEntry: 'early' | 'mid' | 'late';
  fundingLevel: FundingStage;
  teamSize: number;
  technologyMaturity: number; // 1-10
  marketCompetition: number; // 1-10
  regulatoryEnvironment: number; // 1-10
  economicConditions: number; // 1-10
  patentStrength: number; // 1-10
}

export interface SimulationResults {
  successProbability: number;
  timeToMarket: number; // months
  estimatedRevenue: number;
  marketShare: number;
  riskLevel: 'low' | 'medium' | 'high';
  keySuccessFactors: string[];
  majorRisks: string[];
  recommendations: string[];
  financialProjections: FinancialProjection[];
  milestones: Milestone[];
}

export interface FinancialProjection {
  year: number;
  revenue: number;
  costs: number;
  profit: number;
  fundingNeeded: number;
}

export interface Milestone {
  month: number;
  description: string;
  probability: number;
  dependencies: string[];
}

export interface MonteCarloResult {
  iterations: number;
  successRate: number;
  averageRevenue: number;
  revenueDistribution: number[];
  riskMetrics: {
    var95: number; // Value at Risk 95%
    expectedShortfall: number;
    maxLoss: number;
  };
}

// 리포트 관련 타입
export interface ComprehensiveReport {
  id: string;
  title: string;
  createdAt: string;
  summary: ExecutiveSummary;
  patentAnalysis: PatentAnalysisSection;
  marketAnalysis: MarketAnalysisSection;
  clusteringAnalysis: ClusteringAnalysisSection;
  simulationResults: SimulationSection;
  recommendations: RecommendationSection;
  appendices: AppendixSection;
}

export interface ExecutiveSummary {
  overview: string;
  keyFindings: string[];
  strategicImplications: string[];
  riskAssessment: string;
  nextSteps: string[];
}

export interface PatentAnalysisSection {
  overview: string;
  patentPortfolio: PatentPortfolioSummary;
  technologyLandscape: TechnologyLandscape;
  competitivePosition: CompetitivePosition;
  innovationMetrics: InnovationMetrics;
  detailedAnalysis: PatentAnalysis[];
}

export interface PatentPortfolioSummary {
  totalPatents: number;
  grantedPatents: number;
  pendingPatents: number;
  averageAge: number;
  technologyDistribution: { [key: string]: number };
  qualityScore: number;
}

export interface TechnologyLandscape {
  dominantTechnologies: string[];
  emergingTechnologies: string[];
  technologyGaps: string[];
  innovationTrends: string[];
}

export interface CompetitivePosition {
  marketPosition: string;
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
  differentiationFactors: string[];
}

export interface InnovationMetrics {
  noveltyScore: number;
  inventivenessScore: number;
  marketPotentialScore: number;
  overallInnovationScore: number;
}

export interface MarketAnalysisSection {
  overview: string;
  marketSize: MarketSize;
  trends: MarketTrend[];
  competitiveAnalysis: CompetitiveAnalysis;
  opportunities: MarketOpportunity[];
  riskFactors: string[];
}

export interface ClusteringAnalysisSection {
  overview: string;
  clusteringResults: ClusteringResult;
  insights: ClusteringInsights;
  visualization: VisualizationData;
}

export interface ClusteringInsights {
  technologyClusters: string[];
  marketSegments: string[];
  innovationPatterns: string[];
  strategicImplications: string[];
}

export interface VisualizationData {
  pcaData: any;
  similarityMatrix: number[][];
  clusterMap: any;
}

export interface SimulationSection {
  overview: string;
  scenarios: SimulationScenario[];
  monteCarloResults: MonteCarloResult;
  keyInsights: string[];
}

export interface RecommendationSection {
  strategicRecommendations: StrategicRecommendation[];
  tacticalActions: TacticalAction[];
  timeline: ImplementationTimeline;
  resourceRequirements: ResourceRequirement[];
}

export interface StrategicRecommendation {
  category: string;
  recommendation: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  expectedImpact: string;
}

export interface TacticalAction {
  action: string;
  responsible: string;
  timeline: string;
  successMetrics: string[];
  dependencies: string[];
}

export interface ImplementationTimeline {
  phases: TimelinePhase[];
  criticalPath: string[];
  milestones: Milestone[];
}

export interface TimelinePhase {
  name: string;
  duration: string;
  activities: string[];
  deliverables: string[];
}

export interface ResourceRequirement {
  type: 'human' | 'financial' | 'technical' | 'partnership';
  description: string;
  estimatedCost: number;
  timeline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AppendixSection {
  methodology: string;
  dataSources: string[];
  assumptions: string[];
  limitations: string[];
  glossary: { [key: string]: string };
}

// 최적화 관련 타입들
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  compressionEnabled: boolean;
  offlineMode: boolean;
}

export interface CompressionOptions {
  algorithm: 'gzip' | 'deflate' | 'lz4' | 'custom';
  level: number;
  threshold: number;
  preserveStructure: boolean;
}

export interface OptimizationResult<T> {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  data: T;
  metadata: {
    algorithm: string;
    compressionTime: number;
    decompressionTime: number;
  };
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
  timeout: number;
  timestamp: number;
}

export interface BatchRequest {
  id: string;
  requests: NetworkRequest[];
  maxBatchSize: number;
  timeout: number;
  timestamp: number;
}

export interface NetworkStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDataTransferred: number;
  averageResponseTime: number;
  cacheHitRate: number;
  compressionRatio: number;
  batchEfficiency: number;
}

export interface OptimizationConfig {
  enableCaching: boolean;
  enableCompression: boolean;
  enableNetworkOptimization: boolean;
  cacheTTL: number;
  compressionThreshold: number;
  batchSize: number;
  maxConcurrentRequests: number;
}

export interface OptimizationMetrics {
  cacheHitRate: number;
  compressionRatio: number;
  networkEfficiency: number;
  totalDataSaved: number;
  responseTimeImprovement: number;
  costSavings: number;
}
