export type ActiveView = 'media' | 'schedule' | 'english' | 'tools';

export type PipelineStage = 'topic' | 'script' | 'staging' | 'published' | 'analytics';

export interface MediaAccount {
  id: string;
  name: string;
  subTitle: string;
  badge: string;
  icon: string;
  themeColor: string;
  platforms: string[];
  description: string;
  followerGoal?: string;
  statusTag?: string;
}

export interface CoverLayout {
  mainHeadline: string;      // 封面大字主标题
  subHeadline?: string;       // 封面副标题/钩子
  badgeText?: string;         // 封面分类角标
  colorTheme?: string;        // 封面背景底色主题
  customImageUrl?: string;    // 自定义封面图片或设计图
}

export interface ContentItem {
  id: string;
  accountId: string;
  title: string;
  stage: PipelineStage;
  // 阶段 1: 选题池
  topicSource?: string;       // 选题来源（小红书今日热搜、官方权威发布、对标爆款、读者私信）
  topicNotes?: string;        // 选题痛点与切入视角
  hook?: string;              // 黄金前3秒抓手 / 封面大字
  
  // 阶段 2: 文案草稿
  scriptText?: string;        // 文案正文草稿
  tags: string[];             // 小红书话题标签
  
  // 阶段 3: 预发布定稿版面与排期
  finalDraftTitle?: string;   // 终版定稿标题
  finalDraftBody?: string;    // 终版精修排版文案
  coverLayout?: CoverLayout;  // 预发布封面版面配置
  targetDate?: string;        // 预定发布时间
  platforms: string[];        // 拟分发平台
  coverNote?: string;         // 封面拍摄/作图构图提示
  
  // 阶段 4: 已发布
  publishedUrl?: string;      // 实际发布链接
  publishedAt?: string;
  
  // 阶段 5: 复盘
  metrics?: {
    views?: number;
    likes?: number;
    collects?: number;
    comments?: number;
    retentionRate?: string;
    keyTakeaway?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface TrendingTopic {
  id: string;
  accountId: string;
  keyword: string;
  heat: string;               // 爆款热度指数
  sourceType: string;         // "小红书热搜榜", "高赞爆款参考", "搜索下拉词"
  suggestedAngle: string;     // 推荐爆款切入视角
  sampleHook: string;         // 推荐开头钩子
  tags: string[];
}

// 每日 AI 权威情报条目
export interface AIIntelligenceItem {
  id: string;
  title: string;
  organization: 'OpenAI' | 'Anthropic' | 'Google DeepMind' | 'Cursor' | 'DeepSeek' | 'Meta';
  date: string;
  credibility: '官方原厂发布' | '官方技术白皮书' | '开发者大会官方纪要';
  summary: string;
  technicalImpact: string;    // 技术价值与深度
  contentAngle: string;        // 适合自媒体传播的切入角度
  sampleHook: string;         // 视频/图文前3秒开头抓手
  tags: string[];
  officialUrl: string;
}

export type TaskPriority = 'P1' | 'P2' | 'P3';

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  sourceAccountId?: string;
  linkedContentTitle?: string;
  createdAt: number;
}

export type EnglishCategory = 'daily' | 'foreign_trade' | 'healing' | 'ai_frontier';

export interface SavedWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  tag?: string;
  contextSentence?: string;
  passageTitle?: string;
  addedAt: number;
  mastered?: boolean;
}

export interface ExtendedScenario {
  situation: string;          // 拓展场景情境
  dialogueEn: string;         // 拓展英文表达/变体
  dialogueZh: string;         // 中文翻译
}

export interface EnglishPhrase {
  id: string;
  category: EnglishCategory;
  english: string;
  chinese: string;
  scenario: string;
  phonetic?: string;
  mastered: boolean;
  usageNotes: string[];       // 词句关键用法与语法拆解
  extendedScenarios: ExtendedScenario[]; // 延伸场景与实战变体
  nativeAlternatives?: string[]; // 地道替换同义句
  sourceOrigin?: string;      // 语料来源：每日自动推送 / 网页导入 / 视频字幕 / 书籍文档 / 手动录入
}

export type ActiveTool = 'json' | 'base64' | 'hash-uuid' | 'diff' | 'regex' | 'contrast' | 'jwt';

// --- 全国英语专业八级考试 (TEM-8) 系统化备考板块类型 ---
export type TEM8Section = 'listening' | 'reading' | 'proofreading' | 'writing' | 'oral';

export interface TEM8ListeningLecture {
  id: string;
  type: 'mini_lecture' | 'interview';
  title: string;
  sourceExam: string;           // 如 "专八真题 权威讲座"
  audioDuration: string;
  speaker: string;
  topicBackground: string;
  fullTranscript: string;
  outlineNotes: {
    heading: string;
    gapNumber?: number;
    textWithGap: string;
    correctAnswer: string;
    notesHint: string;
  }[];
  keyVocabulary: { word: string; phonetic: string; meaning: string }[];
}

export interface TEM8ReadingPassage {
  id: string;
  source: 'The Economist' | 'Time' | 'Newsweek' | 'The Atlantic' | 'National Geographic';
  title: string;
  sourceIssue: string;
  wordCount: number;
  articlePassage: string;
  chineseSummary: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  shortAnswer: {
    prompt: string;
    referenceAnswer: string;
    scoringKey: string;
  };
  criticalVocab: { word: string; phonetic: string; meaning: string }[];
}

export interface TEM8ProofreadingPassage {
  id: string;
  title: string;
  sourceExam: string;
  summary: string;
  lines: {
    lineNo: number;
    text: string;
    hasError: boolean;
    errorType?: 'grammar' | 'collocation' | 'logic';
    originalWord?: string;
    correction: string; // 删去/替换为/增添
    explanation: string;
  }[];
}

export interface TEM8WritingPrompt {
  id: string;
  type: 'opinion' | 'problem_solving' | 'commentary';
  title: string;
  sourceExam: string;
  materialsExcerpt: string;
  requiredWordCount: string;
  framework: {
    step: string;
    purpose: string;
    keySentences: string[];
  }[];
  modelEssay: string;
  essayAnalysis: string;
  linkingDevices: string[];
}

export interface TEM8OralTask {
  id: string;
  taskType: 'retelling' | 'impromptu_speech' | 'debate';
  title: string;
  preparationTime: string;
  speakingTime: string;
  backgroundMaterial: string;
  structureGuidelines: {
    phase: string;
    duration: string;
    talkingPoints: string[];
  }[];
  goldenExpressions: { en: string; zh: string; usage: string }[];
  samplePresentation: string;
}

