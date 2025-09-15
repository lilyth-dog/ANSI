'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  FileText,
  Image,
  Wand2,
  Save,
  Download,
  Eye,
  Edit3,
  Lightbulb,
  Target,
  Zap,
  Brain,
  PenTool,
  ArrowLeft
} from 'lucide-react';
import { Patent } from '@/types';
import { patentDraftService, PatentDraftInput } from '@/lib/patent-draft';
import dynamic from 'next/dynamic';

// React Quill 동적 import (SSR 문제 해결)
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">편집기 로딩 중...</div>
});

import 'react-quill/dist/quill.snow.css';

export default function PatentDraftPage() {
  const searchParams = useSearchParams();
  const patentId = searchParams.get('patentId');

  const [claims, setClaims] = useState('');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [partsList, setPartsList] = useState<string[]>([]);
  const [figures, setFigures] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [confidence, setConfidence] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableDraft, setEditableDraft] = useState('');

  // Quill 에디터 설정
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'color', 'background', 'align'
  ];

  const toggleEditMode = () => {
    if (!isEditMode) {
      // 편집 모드로 전환 시 현재 초안을 편집본으로 복사
      setEditableDraft(generatedDraft);
    }
    setIsEditMode(!isEditMode);
  };

  const saveEditedDraft = () => {
    setGeneratedDraft(editableDraft);
    setIsEditMode(false);
  };

  // 모의 특허 데이터 (실제로는 API로 가져와야 함)
  const mockPatent: Patent = {
    id: patentId || 'KR1020240012345',
    title: 'AI 기반 감정 분석 시스템 및 방법',
    abstract: '본 발명은 음성 데이터를 분석하여 사용자의 감정 상태를 실시간으로 파악하는 AI 기반 감정 분석 시스템에 관한 것이다.',
    inventors: ['김철수', '이영희'],
    applicants: ['테크스타트업 주식회사'],
    applicationDate: '2024-01-15',
    publicationDate: '2024-03-20',
    status: 'published' as any,
    classification: ['G06N 3/08', 'G10L 25/63'],
    claims: ['청구항 1: 음성 데이터를 수신하는 단계...'],
    description: '상세한 기술 설명...',
    drawings: ['도면1', '도면2'],
    legalStatus: 'active',
    citations: ['KR1020230056789'],
    familyPatents: ['US20240012345']
  };

  useEffect(() => {
    if (patentId && mockPatent) {
      setTitle(mockPatent.title);
      setAbstract(mockPatent.abstract);
      // 청구항 샘플 데이터
      setClaims(`청구항 1: 음성 데이터를 수신하는 입력부;
청구항 2: 상기 음성 데이터를 분석하는 AI 처리부;
청구항 3: 감정 상태를 판별하는 분석 엔진;
청구항 4: 분석 결과를 출력하는 출력부;`);
    }
  }, [patentId]);

  const generateAIDraft = async () => {
    if (!claims.trim() || !title.trim()) return;

    setIsGenerating(true);

    try {
      const draftInput: PatentDraftInput = {
        title,
        abstract: abstract || '상세한 초록이 제공되지 않았습니다.',
        claims,
        inventors: mockPatent.inventors,
        applicant: mockPatent.applicants[0] || '출원인 미정'
      };

      const result = await patentDraftService.generateDraft(draftInput);

      setGeneratedDraft(result.draft);
      setEditableDraft(result.draft); // 편집용 복사본
      setPartsList(result.partsList);
      setFigures(result.figures);
      setConfidence(result.confidence);
      setActiveTab('draft');

    } catch (error) {
      console.error('AI 초안 생성 오류:', error);
      // 오류 발생 시 기본 모의 데이터 사용
      setGeneratedDraft(`# ${title}

## 초록 (Abstract)

${abstract || 'AI 초안 생성 중 오류가 발생했습니다. 청구항을 기반으로 한 기본 템플릿입니다.'}

## 발명의 내용 (Disclosure)

${claims}

*참고: OpenAI API 키가 설정되지 않아 모의 데이터를 생성했습니다. API 키를 설정하면 더 정확한 초안이 생성됩니다.*`);

      setPartsList(['입력부', '처리부', '출력부']);
      setFigures(['시스템 구성도']);
      setConfidence(65);
      setActiveTab('draft');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container-patent py-12">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-6 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            검색으로 돌아가기
          </Button>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 text-blue-800 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <Sparkles className="h-4 w-4 text-blue-600" />
            Onardo AI 초안 생성
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            AI 특허 초안
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 생성</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            청구항을 입력하면 Onardo AI가 특허 초안을 자동으로 작성합니다
          </p>
        </div>

        {/* Premium Main Content */}
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-xl shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              <div className="space-y-8">
                {/* Premium Input Section */}
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">특허 정보 입력</h2>
                    <p className="text-gray-600 text-lg">AI가 초안을 작성할 정보를 입력하세요</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">특허 제목</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="특허 제목을 입력하세요"
                          className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">발명자</label>
                        <Input
                          value={inventors}
                          onChange={(e) => setInventors(e.target.value)}
                          placeholder="발명자 이름을 입력하세요"
                          className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">출원인</label>
                        <Input
                          value={applicant}
                          onChange={(e) => setApplicant(e.target.value)}
                          placeholder="출원인 이름을 입력하세요"
                          className="h-12 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">초록</label>
                        <Textarea
                          value={abstract}
                          onChange={(e) => setAbstract(e.target.value)}
                          placeholder="특허 초록을 입력하세요"
                          rows={4}
                          className="text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">청구항</label>
                        <Textarea
                          value={claims}
                          onChange={(e) => setClaims(e.target.value)}
                          placeholder="청구항을 입력하세요 (각 청구항은 줄바꿈으로 구분)"
                          rows={6}
                          className="text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white/50 backdrop-blur-sm resize-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200/50">
                    <Button
                      onClick={generateAIDraft}
                      disabled={!title.trim() || !abstract.trim() || !claims.trim() || isGenerating}
                      className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                          <span>Onardo AI가 특허 초안을 생성하고 있습니다...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-6 w-6" />
                          <span>AI 초안 생성하기</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Result Section */}
            {generatedDraft && (
              <div className="border-t border-gray-200/50 pt-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-200/50 text-green-800 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    AI 초안 생성 완료
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    생성된 특허 초안
                  </h3>

                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-700">신뢰도: {confidence}%</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditMode ? '보기 모드' : '편집하기'}
                    </Button>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 p-8">
                  {isEditMode ? (
                    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                      <ReactQuill
                        value={editableDraft}
                        onChange={setEditableDraft}
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                        style={{ minHeight: '500px' }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 rounded-2xl border border-gray-100">
                      <div
                        className="text-base leading-relaxed text-gray-800 font-medium"
                        dangerouslySetInnerHTML={{
                          __html: generatedDraft.replace(/\n\n/g, '</p><p class="mt-4">').replace(/\n/g, '<br>')
                        }}
                      />
                    </div>
                  )}

                  {isEditMode && (
                    <div className="mt-6 flex gap-4 justify-center">
                      <Button
                        onClick={saveEditedDraft}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        저장하기
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(false)}
                        className="px-8 py-3 rounded-xl border-2 font-semibold"
                      >
                        취소
                      </Button>
                    </div>
                  )}
                </div>

                {/* Premium Parts List */}
                {partsList.length > 0 && (
                  <div className="mt-10">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">추출된 부품 목록</h4>
                      <p className="text-gray-600">청구항에서 자동으로 추출된 주요 부품들입니다</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {partsList.map((part, index) => (
                        <div key={index} className="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{part}</p>
                              <p className="text-xs text-gray-500 mt-1">청구항에서 추출됨</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
