export const candidateProfile = {
  name: "Demo Candidate",
  email: "demo.user@neuronai.ai",
  role: "Senior AI Systems Engineer",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  streakDays: 7,
  totalInterviews: 18,
  prepTimeHours: 42.5,
  avgConfidence: 86,
  readinessScore: 92,
  level: "Level 4 • Staff AI Architect",
  statusBadge: "Ready for Live Benchmarks",
  todayGoal: {
    title: "Master MCP Error Handling & Circuit Breakers",
    completed: 2,
    total: 3,
  },
  aiRecommendation: "Focus on async event loop backoff and sliding window context.",
  targetRole: "Staff AI Systems Engineer",
  targetCompany: "Anthropic / OpenAI / Scale AI",
  skillsCovered: 24,
  totalSkills: 30,
}

export const skillHeatmap = [
  { name: "Model Context Protocol (MCP)", level: "Master", score: 94, category: "Protocols" },
  { name: "Vector RAG Architectures", level: "Expert", score: 90, category: "Search & Retrieval" },
  { name: "Prompt Chain-of-Thought", level: "Master", score: 96, category: "Prompt Engineering" },
  { name: "LangGraph Multi-Agent", level: "Advanced", score: 85, category: "Agentic Systems" },
  { name: "vLLM PagedAttention", level: "Intermediate", score: 76, category: "LLM Ops & Inference" },
  { name: "Asynchronous Queue Backoff", level: "Intermediate", score: 72, category: "Infrastructure" },
]

export const learningProgressData = [
  { day: "Mon", readiness: 78, confidence: 75, sessions: 2 },
  { day: "Tue", readiness: 82, confidence: 79, sessions: 3 },
  { day: "Wed", readiness: 85, confidence: 81, sessions: 1 },
  { day: "Thu", readiness: 88, confidence: 84, sessions: 4 },
  { day: "Fri", readiness: 90, confidence: 85, sessions: 2 },
  { day: "Sat", readiness: 92, confidence: 88, sessions: 3 },
  { day: "Sun", readiness: 94, confidence: 91, sessions: 2 },
]

export const weeklyActivityData = [
  { day: "Mon", hours: 2.5, score: 78 },
  { day: "Tue", hours: 4.0, score: 84 },
  { day: "Wed", hours: 1.5, score: 82 },
  { day: "Thu", hours: 5.2, score: 90 },
  { day: "Fri", hours: 3.0, score: 88 },
  { day: "Sat", hours: 4.5, score: 93 },
  { day: "Sun", hours: 2.0, score: 89 },
]

export const recentReportsData = [
  {
    id: "rep-9812",
    title: "Model Context Protocol (MCP) Deep-Dive",
    date: "Today, 10:30 AM",
    score: 88,
    rating: "Staff Level Ready",
    topic: "MCP Architecture & Security",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "rep-9810",
    title: "Hybrid Vector Search & RAG Evaluation",
    date: "Yesterday",
    score: 92,
    rating: "Top 3% Candidate",
    topic: "Vector DB & RAG",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "rep-9805",
    title: "LangGraph & Stateful Agent Workflows",
    date: "3 days ago",
    score: 84,
    rating: "Senior Level Ready",
    topic: "Agentic Systems",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }
]

export const skillGapData = {
  readinessScore: 92,
  weeklyGrowth: "+5%",
  strongTopics: [
    { name: "Model Context Protocol (MCP)", score: 94, category: "Protocols", level: "Master", priority: "Low" },
    { name: "Prompt Chain-of-Thought", score: 96, category: "Prompt Engineering", level: "Master", priority: "Low" },
    { name: "Vector RAG Architectures", score: 90, category: "Search & Retrieval", level: "Expert", priority: "Low" },
    { name: "Sliding Window Context Compression", score: 91, category: "Memory", level: "Expert", priority: "Low" },
  ],
  weakTopics: [
    { name: "vLLM PagedAttention & KV Cache", score: 76, category: "LLM Ops", level: "Intermediate", priority: "High", recommendation: "Benchmark KV cache memory footprint & GPU throughput limits." },
    { name: "Asynchronous Queue Backoff", score: 72, category: "Infrastructure", level: "Intermediate", priority: "High", recommendation: "Implement exponential backoff circuit breakers for async tool retries." },
    { name: "AWQ vs GGUF Zero-Downtime Quantization", score: 68, category: "Quantization", level: "Developing", priority: "Medium", recommendation: "Study weight quantization impact on low-latency inference." },
    { name: "Multi-Agent Circuit Breakers", score: 74, category: "Agentic Systems", level: "Intermediate", priority: "Medium", recommendation: "Add fallback state machines for agent-to-agent handoffs." },
  ],
  recommendedLearningPath: [
    { step: "01", title: "vLLM PagedAttention Deep Dive", duration: "2 days", status: "In Progress", focus: "LLM Ops" },
    { step: "02", title: "Async Queue Circuit Breaker Workshop", duration: "3 days", status: "Upcoming", focus: "Infrastructure" },
    { step: "03", title: "Multi-Agent Handshake Simulation", duration: "2 days", status: "Upcoming", focus: "Agentic Loops" },
    { step: "04", title: "Staff Mock System Panel", duration: "1 day", status: "Upcoming", focus: "System Design" },
  ],
  recommendedNextInterview: {
    topic: "vLLM PagedAttention & KV Cache Optimization",
    category: "LLM Ops & Inference",
    estTime: "30 mins",
    difficulty: "Hard",
    impact: "+4% Readiness Score Increase"
  },
  improvementTimeline: [
    { month: "Week 1", score: 78, benchmark: 75 },
    { month: "Week 2", score: 82, benchmark: 77 },
    { month: "Week 3", score: 85, benchmark: 80 },
    { month: "Week 4", score: 88, benchmark: 82 },
    { month: "Current", score: 92, benchmark: 85 },
  ]
}

export const knowledgeMapData = {
  overallKnowledgeScore: 91,
  benchmarkComparison: "Top 3% of AI Systems Engineers",
  radarData: [
    { subject: 'RAG Architecture', Score: 94, Target: 85, FullMark: 100 },
    { subject: 'Vector Search', Score: 88, Target: 80, FullMark: 100 },
    { subject: 'Prompt Guardrails', Score: 96, Target: 88, FullMark: 100 },
    { subject: 'MCP Transport Security', Score: 90, Target: 82, FullMark: 100 },
    { subject: 'Stateful Agent Loops', Score: 86, Target: 80, FullMark: 100 },
    { subject: 'vLLM & Inference Ops', Score: 78, Target: 85, FullMark: 100 },
  ],
  topicCoverage: [
    { category: "Protocols & Transports", coverage: 92, status: "Mastered", color: "from-indigo-500 to-purple-500" },
    { category: "RAG & Vector Retrieval", coverage: 90, status: "Mastered", color: "from-purple-500 to-pink-500" },
    { category: "Agentic Loop Orchestration", coverage: 85, status: "Advanced", color: "from-cyan-500 to-blue-500" },
    { category: "LLM Ops & GPU Inference", coverage: 76, status: "Intermediate", color: "from-amber-500 to-orange-500" },
    { category: "Prompt Engineering & Guardrails", coverage: 96, status: "Mastered", color: "from-emerald-500 to-teal-500" },
  ],
  strongSkills: [
    { title: "JSON-RPC Bidirectional Handshake", score: 95, detail: "Demonstrated zero-overhead schema negotiation over stdio & SSE." },
    { title: "Zero-Shot Guardrail Enforcement", score: 96, detail: "Flawless context window sliding compression & dynamic trimming." },
    { title: "Hybrid Vector Search Strategy", score: 92, detail: "Implemented dense + sparse BM25 reranking with reciprocal rank fusion." },
  ],
  weakSkills: [
    { title: "vLLM KV Cache Allocation", score: 76, tip: "Practice PagedAttention block table mapping to prevent VRAM fragmentation." },
    { title: "Async Tool Backoff Jitter", score: 72, tip: "Implement full jitter exponentially increasing backoff algorithm for API calls." },
  ],
  learningInsights: [
    { id: 1, type: "Strength", text: "Your command over Model Context Protocol (MCP) transport security ranks in the 98th percentile." },
    { id: 2, type: "Focus Area", text: "Mastering vLLM PagedAttention will boost your overall technical score past 95%." },
    { id: 3, type: "Recommendation", text: "Schedule a mock panel interview focused on distributed GPU LLM inference." },
  ]
}

export const allReportsData = [
  {
    id: "rep-9812",
    title: "Model Context Protocol (MCP) Deep-Dive",
    date: "August 08, 2026",
    role: "Senior AI Systems Engineer",
    technicalScore: 94,
    communicationScore: 89,
    overallScore: 92,
    rating: "Staff Level Ready",
    duration: "45m 12s",
    difficulty: "Hard",
    topic: "MCP Architecture & Security",
    hiringVerdict: "Strong Hire",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "rep-9810",
    title: "Hybrid Vector Search & RAG Evaluation",
    date: "August 07, 2026",
    role: "AI Retrieval Architect",
    technicalScore: 92,
    communicationScore: 91,
    overallScore: 91,
    rating: "Top 3% Candidate",
    duration: "38m 45s",
    difficulty: "Hard",
    topic: "Vector DB & RAG",
    hiringVerdict: "Strong Hire",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "rep-9805",
    title: "LangGraph & Stateful Agent Workflows",
    date: "August 05, 2026",
    role: "Agentic Systems Lead",
    technicalScore: 85,
    communicationScore: 83,
    overallScore: 84,
    rating: "Senior Level Ready",
    duration: "42m 10s",
    difficulty: "Medium",
    topic: "Agentic Systems",
    hiringVerdict: "Hire",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "rep-9799",
    title: "vLLM Inference & Quantization Systems",
    date: "August 02, 2026",
    role: "LLM Ops Specialist",
    technicalScore: 78,
    communicationScore: 82,
    overallScore: 80,
    rating: "Developing Senior",
    duration: "35m 00s",
    difficulty: "Hard",
    topic: "LLM Ops & Inference",
    hiringVerdict: "Consider with Mentorship",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "rep-9788",
    title: "Prompt Engineering & Structural Guardrails",
    date: "July 29, 2026",
    role: "AI Prompt Architect",
    technicalScore: 96,
    communicationScore: 94,
    overallScore: 95,
    rating: "Principal Ready",
    duration: "40m 30s",
    difficulty: "Medium",
    topic: "Prompt Engineering",
    hiringVerdict: "Strong Hire",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  }
]

export const interviewHistoryData = [
  {
    id: "hist-1092",
    date: "Aug 08, 2026 • 10:30 AM",
    role: "Senior AI Systems Engineer",
    topic: "MCP Architecture & Secure Tool Call Integration",
    score: 92,
    duration: "45m 12s",
    difficulty: "Hard",
    status: "Completed",
    reportId: "rep-9812"
  },
  {
    id: "hist-1088",
    date: "Aug 07, 2026 • 04:15 PM",
    role: "AI Retrieval Architect",
    topic: "Hybrid Vector Search & RAG Evaluation",
    score: 91,
    duration: "38m 45s",
    difficulty: "Hard",
    status: "Completed",
    reportId: "rep-9810"
  },
  {
    id: "hist-1075",
    date: "Aug 05, 2026 • 02:00 PM",
    role: "Agentic Systems Lead",
    topic: "LangGraph Stateful Agent Loop Orchestration",
    score: 84,
    duration: "42m 10s",
    difficulty: "Medium",
    status: "Completed",
    reportId: "rep-9805"
  },
  {
    id: "hist-1061",
    date: "Aug 02, 2026 • 11:30 AM",
    role: "LLM Ops Specialist",
    topic: "vLLM PagedAttention & GPU VRAM Allocation",
    score: 80,
    duration: "35m 00s",
    difficulty: "Hard",
    status: "Completed",
    reportId: "rep-9799"
  },
  {
    id: "hist-1049",
    date: "Jul 29, 2026 • 09:00 AM",
    role: "AI Prompt Architect",
    topic: "Zero-Shot Chain of Thought Guardrails",
    score: 95,
    duration: "40m 30s",
    difficulty: "Medium",
    status: "Completed",
    reportId: "rep-9788"
  },
  {
    id: "hist-1032",
    date: "Jul 25, 2026 • 03:20 PM",
    role: "Fullstack AI Engineer",
    topic: "Client-side Stream Chunk Parsing & SSE Transports",
    score: 88,
    duration: "30m 15s",
    difficulty: "Easy",
    status: "Completed",
    reportId: "rep-9812"
  }
]

export const memoryTimeline = [
  { turn: "Turn 1", topic: "MCP Handshake Protocol", status: "Verified Depth", timestamp: "10:31 AM" },
  { turn: "Turn 2", topic: "JSON-RPC over stdio", status: "Security Validated", timestamp: "10:33 AM" },
  { turn: "Turn 3", topic: "Dynamic Context Trimming", status: "Sliding Window Approved", timestamp: "10:35 AM" },
  { turn: "Turn 4", topic: "Async Circuit Breakers", status: "Probing Edge Cases", timestamp: "10:37 AM" },
]

export const aiReasoningLogs = [
  "Evaluating capability negotiation handshake response...",
  "Context window utilization calculated at 74% limits.",
  "Injecting adaptive follow-up on asynchronous fallback jitter.",
  "Comparing candidate schema model against Anthropic Staff Benchmark.",
]

export const initialInterviewSession = {
  id: "int-1092",
  title: "Model Context Protocol (MCP) Architecture",
  topic: "MCP Architecture & Secure Tool Call Integration",
  totalQuestions: 10,
  currentQuestionIndex: 4,
  difficulty: "Hard",
  confidenceScore: 86,
  timerSeconds: 1122, // 18m 42s
  status: "Live & Adaptive",
  estAnswerTime: "2m 30s",
  insights: {
    questionsAsked: 4,
    followUps: 2,
    avgResponseTime: "42s",
    sentiment: "High Technical Rigor",
  },
  progressData: [
    { question: 'Q1', score: 75 },
    { question: 'Q2', score: 82 },
    { question: 'Q3', score: 91 },
    { question: 'Q4', score: 86 },
    { question: 'Q5', score: null },
    { question: 'Q6', score: null },
    { question: 'Q7', score: null },
    { question: 'Q8', score: null },
    { question: 'Q9', score: null },
    { question: 'Q10', score: null },
  ],
  radarData: [
    { subject: 'RAG Architecture', score: 92, fullMark: 100 },
    { subject: 'Vector Search', score: 78, fullMark: 100 },
    { subject: 'Prompt Eng.', score: 96, fullMark: 100 },
    { subject: 'MCP Protocols', score: 88, fullMark: 100 },
    { subject: 'Agentic Loops', score: 84, fullMark: 100 },
    { subject: 'LLM Ops', score: 80, fullMark: 100 },
  ],
  skillGap: {
    strong: { count: 6, percentage: 65, label: "Strong (RAG, Prompt Eng, Context Trimming...)" },
    average: { count: 3, percentage: 25, label: "Average (Vector DB, MCP Transport...)" },
    weak: { count: 2, percentage: 10, label: "Weak (vLLM Quantization, Circuit Breakers...)" },
  },
  messages: [
    {
      id: "msg-1",
      sender: "ai",
      timestamp: "10:30 AM",
      content: "Hello! Welcome to your technical deep-dive on **Model Context Protocol (MCP)**. Let's begin with foundational architecture.\n\nExplain how Model Context Protocol (MCP) ensures secure communication between a host application and an external LLM model client.",
      badge: "Question 1/10",
      estTime: "2 min",
    },
    {
      id: "msg-2",
      sender: "user",
      timestamp: "10:32 AM",
      content: "MCP ensures secure communication through authentication tokens, transport-layer authorization (such as JSON-RPC over stdio or SSE), and strict tool schema validation. The host and model establish a bidirectional handshake where capabilities are explicitly negotiated before any prompt execution.",
    },
    {
      id: "msg-3",
      sender: "ai",
      timestamp: "10:33 AM",
      content: "Excellent explanation of the JSON-RPC channel and capability negotiation! Let's probe deeper into dynamic context limits.",
      badge: "Follow-up Question",
      followUp: true,
      contentFollowUp: "Can you explain the role of context window management in MCP and how it prevents context overflow during multi-turn agentic tool calls?",
      estTime: "2m 30s",
    },
    {
      id: "msg-4",
      sender: "user",
      timestamp: "10:34 AM",
      content: "Context window management in MCP involves dynamic sliding window summarization, chunk trimming, and prioritizing tool output schemas. When context limits approach 80% threshold, older system messages are compressed or offloaded to a persistent vector store.",
    }
  ],
  nextSimulatedQuestions: [
    {
      question: "How would you handle asynchronous tool call failures in an MCP server without blocking the main event loop?",
      followUp: true,
      topic: "MCP Error Handling & Resilience",
      estTime: "3 min"
    },
    {
      question: "What security considerations arise when exposing local filesystem resources to an LLM host via MCP servers?",
      followUp: false,
      topic: "MCP Security & Sandboxing",
      estTime: "2m 30s"
    },
    {
      question: "Compare MCP vs OpenAPI Function Calling schemas. In what scenarios is MCP superior?",
      followUp: false,
      topic: "Protocol Comparison",
      estTime: "2 min"
    }
  ]
}

export const finalReportData = {
  id: "rep-9812",
  candidateName: "Demo Candidate",
  date: "August 08, 2026",
  roleEvaluated: "Senior AI Systems Engineer",
  overallScore: 92,
  matchRating: "Staff Level Ready (Top 3%)",
  hiringRecommendation: "STRONG HIRE (Staff Level Ready)",
  executiveSummary: "Demo Candidate demonstrated top-tier engineering maturity during the 45-minute autonomous MCP & RAG interview session. Evaluated at 92/100, the candidate exhibited staff-level command over JSON-RPC transports, token isolation, sliding-window context compression, and agentic loop orchestration.",
  aiSummary: "Candidate articulated precise architectural primitives for Model Context Protocol. Identified key security boundary requirements when binding host endpoints to LLM runtime engines. Commendable clarity in prompt guardrails and zero-shot reasoning loops.",
  scores: {
    technicalScore: 94,
    communicationScore: 89,
    systemDesignScore: 92,
    problemSolvingScore: 93,
  },
  radarData: [
    { subject: 'RAG Systems', Candidate: 94, Benchmark: 80 },
    { subject: 'Vector Search', Candidate: 82, Benchmark: 75 },
    { subject: 'Prompt Eng.', Candidate: 96, Benchmark: 82 },
    { subject: 'MCP Protocols', Candidate: 90, Benchmark: 70 },
    { subject: 'Agentic Workflows', Candidate: 86, Benchmark: 75 },
    { subject: 'LLM Ops & Deploy', Candidate: 82, Benchmark: 78 },
  ],
  timeline: [
    { q: "Q1: MCP Secure Transport", score: 75, duration: "1m 45s", verdict: "Solid Foundation" },
    { q: "Q2: JSON-RPC Capability Negotiation", score: 82, duration: "2m 10s", verdict: "High Precision" },
    { q: "Q3: Context Window Sliding Compression", score: 91, duration: "2m 30s", verdict: "Staff Level Depth" },
    { q: "Q4: Async Tool Call Failovers", score: 86, duration: "2m 15s", verdict: "Resilient Pattern" },
  ],
  strengths: [
    {
      title: "Deep Protocol Mastery (MCP)",
      description: "Articulated precise JSON-RPC bidirectional handshakes, security token transport, and tool schema negotiation.",
    },
    {
      title: "Advanced Prompt Architecture",
      description: "Demonstrated 95th percentile capability in zero-shot chain-of-thought prompt structure and output guardrails.",
    },
    {
      title: "Resilient Context Trimming",
      description: "Proposed realistic sliding-window summarization for multi-turn agentic conversations.",
    }
  ],
  weaknesses: [
    {
      title: "Edge LLM Deployment Benchmarks",
      description: "Slight hesitation when discussing vLLM vs Ollama throughput optimization and kernel quantization trade-offs.",
      recommendation: "Review vLLM PagedAttention paper and tensor parallel execution configs."
    },
    {
      title: "Asynchronous Tool Retry Backoff",
      description: "Could expand on exponential backoff and circuit breaker patterns for third-party API tool calls.",
      recommendation: "Implement resilient async queue handlers with exponential jitter."
    }
  ],
  roadmap: [
    { week: "Week 1", title: "vLLM & PagedAttention Deep Dive", status: "Completed", desc: "Benchmark KV cache memory footprint & GPU throughput limits." },
    { week: "Week 2", title: "MCP Custom Server Development", status: "Completed", desc: "Build custom stdio & SSE transport adapters in Rust/TypeScript." },
    { week: "Week 3", title: "Agentic Circuit Breakers", status: "In Progress", desc: "Implement fault-tolerant fallbacks for multi-agent tool handoffs." },
    { week: "Week 4", title: "Mock Staff Panel Interview", status: "Upcoming", desc: "Simulate 60-min live system architecture interview with AI Panel." },
  ],
  recommendedNextTopics: [
    { topic: "vLLM KV Cache PagedAttention Tuning", difficulty: "Hard", estTime: "45 min" },
    { topic: "Multi-Agent Handoff State Machines in LangGraph", difficulty: "Staff Level", estTime: "60 min" },
    { topic: "Zero-Downtime Quantization (AWQ vs GGUF)", difficulty: "Medium", estTime: "30 min" },
  ],
  recommendations: [
    "Target Senior to Staff Level AI Infrastructure roles.",
    "Highlight MCP contribution and agentic workflow resilience in resume.",
    "Schedule a 15-minute mock system design follow-up to solidify quantization topics."
  ]
}

export const landingFeatures = [
  {
    icon: "Brain",
    title: "Autonomous AI Interviewer",
    description: "Evaluates your answers in real time and dynamically adjusts question difficulty based on your depth of response.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: "MessageSquareCode",
    title: "Intelligent Follow-ups",
    description: "Probes edge cases and underlying architectural choices, simulating a true Senior Staff Engineer interview panel.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: "Cpu",
    title: "Interview Memory & Context",
    description: "Remembers your past answers across turns to challenge contradictions and praise consistent technical depth.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: "Radar",
    title: "Live Knowledge Map",
    description: "Multi-dimensional polygon telemetry tracking your core competency across RAG, Vector DB, MCP, and AI Ops.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: "Activity",
    title: "Confidence & Sentiment Meter",
    description: "Monitors tone, response clarity, and structural precision with real-time feedback meters.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: "FileCheck2",
    title: "Comprehensive Report & Roadmap",
    description: "Generates actionable 4-week tailored learning plans, skill gap breakdowns, and benchmark ratings.",
    color: "from-pink-500 to-rose-600",
  }
]

export const whyChooseNeuronAI = [
  {
    title: "Autonomous Probing vs Static Prompts",
    description: "Unlike static AI chats, NeuronAI remembers previous context, probes security trade-offs, and enforces strict technical benchmarks.",
    icon: "Sparkles",
    badge: "Architectural Rigor",
  },
  {
    title: "Real-time Multi-dimensional Telemetry",
    description: "Track confidence, technical clarity, skill heatmaps, and difficulty scaling live during every interview session.",
    icon: "Activity",
    badge: "Live Telemetry",
  },
  {
    title: "Staff Level Hiring Recommendations",
    description: "Get comprehensive executive summaries, 4-week learning roadmaps, and instant candidate match ratings.",
    icon: "Award",
    badge: "Hiring Report",
  }
]

export const aiWorkflowSteps = [
  {
    step: "01",
    title: "Role & Target Alignment",
    description: "Select specialized tracks (Model Context Protocol, RAG, System Design) or candidate profile.",
    icon: "Target",
  },
  {
    step: "02",
    title: "Real-time Probing & Voice/Code",
    description: "Engage in voice dictation, chat, or interactive code snippet submissions under live AI observation.",
    icon: "Terminal",
  },
  {
    step: "03",
    title: "Adaptive Difficulty Scaling",
    description: "NeuronAI dynamically elevates questions to Staff level when strong technical depth is detected.",
    icon: "Zap",
  },
  {
    step: "04",
    title: "Executive Scorecard & Roadmap",
    description: "Receive instant hiring recommendations, strength breakdowns, and structured learning roadmaps.",
    icon: "Award",
  }
]

export const faqList = [
  {
    q: "How does NeuronAI adapt difficulty during the interview?",
    a: "NeuronAI uses real-time response evaluation. If you answer with strong architectural depth, it automatically elevates to Staff/Principal level follow-ups. If you miss key primitives, it gently breaks down foundational concepts."
  },
  {
    q: "Can I use voice dictation and code snippets?",
    a: "Yes! NeuronAI supports voice-to-text dictation simulation, interactive code block attachments, and inline syntax highlighting for technical system design challenges."
  },
  {
    q: "What makes this different from generic ChatGPT interview prompts?",
    a: "Unlike static chat prompts, NeuronAI runs structured interview memory, live radar knowledge mapping, skill gap analysis, adaptive difficulty algorithms, and generates actionable post-interview learning roadmaps."
  },
  {
    q: "Is NeuronAI suitable for hackathons and live demonstrations?",
    a: "Absolutely! Designed specifically with a futuristic cyber-dark aesthetic inspired by Cursor, Vercel, and Linear, it delivers immediate visual impact and production-grade interactivity."
  }
]
