import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Bot,
  Database,
  Sliders,
  Send,
  Plus,
  Trash2,
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Database as DbIcon,
  Briefcase,
  Layers,
  ChevronRight,
  Upload,
  BarChart3,
  RefreshCw,
  Eye
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  LineChart,
  Line
} from "recharts";
import { AnimatePresence, motion } from "motion/react";
import {
  ChatMessage,
  MetricCard,
  DocumentRecord,
  MLPredictionRequest,
  MLPredictionResponse
} from "./types";

// Constant initial metrics data
const INITIAL_METRICS: MetricCard[] = [
  {
    id: "met-1",
    label: "Total Projected Revenue",
    value: "$148,250",
    change: "+18.4%",
    isPositive: true,
    icon: "TrendingUp",
    trendData: [100, 110, 118, 125, 138, 148]
  },
  {
    id: "met-2",
    label: "Customer Conversion",
    value: "4.82%",
    change: "+1.2%",
    isPositive: true,
    icon: "Layers",
    trendData: [3.8, 4.0, 4.2, 4.5, 4.7, 4.8]
  },
  {
    id: "met-3",
    label: "Acquisition Cost (CAC)",
    value: "$42.50",
    change: "+9.1%",
    isPositive: false,
    icon: "TrendingDown",
    trendData: [36, 38, 39, 40, 41, 42.5]
  },
  {
    id: "met-4",
    label: "Avg User Engagement",
    value: "68.4 / 100",
    change: "+4.6%",
    isPositive: true,
    icon: "Bot",
    trendData: [62, 63, 65, 66, 67, 68.4]
  }
];

const HISTORICAL_SALES_DATA = [
  { month: "Jan", actual: 82000, target: 80000, organic: 45000, paid: 37000 },
  { month: "Feb", actual: 95000, target: 85000, organic: 52000, paid: 43000 },
  { month: "Mar", actual: 110000, target: 95000, organic: 63000, paid: 47000 },
  { month: "Apr", actual: 125000, target: 110000, organic: 71000, paid: 54000 },
  { month: "May", actual: 138000, target: 128000, organic: 79000, paid: 59000 },
  { month: "Jun", actual: 148250, target: 140000, organic: 85000, paid: 63250 }
];

const CHANNEL_PERFORMANCE_DATA = [
  { name: "Organic Search", value: 4800, color: "#10b981", conversion: 4.8 },
  { name: "Direct Client", value: 3400, color: "#06b6d4", conversion: 5.2 },
  { name: "Paid Search", value: 2900, color: "#3b82f6", conversion: 2.1 },
  { name: "Social Content", value: 1800, color: "#f59e0b", conversion: 1.2 }
];

const LOYALTY_SEGMENTS_DATA = [
  { name: "VIP Elite", value: 15, color: "#a855f7" },
  { name: "Gold Circle", value: 25, color: "#eab308" },
  { name: "Silver Tier", value: 35, color: "#94a3b8" },
  { name: "Standard Users", value: 25, color: "#64748b" }
];

const SLA_CHURN_CORRELATION_DATA = [
  { week: "Wk 1", avgSlaHours: 11.2, churnRate: 34 },
  { week: "Wk 2", avgSlaHours: 9.5, churnRate: 28 },
  { week: "Wk 3", avgSlaHours: 7.4, churnRate: 19 },
  { week: "Wk 4", avgSlaHours: 6.1, churnRate: 14 },
  { week: "Wk 5", avgSlaHours: 4.2, churnRate: 8 },
  { week: "Wk 6", avgSlaHours: 3.1, churnRate: 5 }
];

const PRICE_ELASTICITY_DATA = [
  { price: "$45", expectedConversion: 12.4, revenueMultiplier: 1.0 },
  { price: "$65", expectedConversion: 9.8, revenueMultiplier: 1.2 },
  { price: "$85", expectedConversion: 7.2, revenueMultiplier: 1.4 },
  { price: "$105", expectedConversion: 4.82, revenueMultiplier: 1.5 },
  { price: "$125", expectedConversion: 3.1, revenueMultiplier: 1.2 },
  { price: "$145", expectedConversion: 1.5, revenueMultiplier: 0.8 }
];

const SUGGESTED_CHIPS = [
  { label: "Analyze support bottleneck factors", icon: "AlertCircle" },
  { label: "Optimize Q3 sales budget breakdown", icon: "TrendingUp" },
  { label: "Draft VIP customer retention campaign", icon: "Sparkles" },
  { label: "Predict churn limits for high-turnaround SLAs", icon: "Sliders" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "rag" | "sandbox">("dashboard");
  
  // Status check state
  const [serverHealth, setServerHealth] = useState<{
    status: string;
    hasGeminiKey: boolean;
    documentsLoaded: number;
    environment: string;
  } | null>(null);

  // RAG State
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [ragQuery, setRagQuery] = useState("");
  const [ragResult, setRagResult] = useState<string>("");
  const [ragSources, setRagSources] = useState<string[]>([]);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [showAddDocForm, setShowAddDocForm] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am **InsightForge AI**, your dedicated business intelligence and analytics growth general. I have digested the database schemas, turnaround analyses, and pricing elasticity sheets.\n\nAsk me any complex questions or click a scenario prompt below to devise high-impact strategic directions or locate retention vulnerabilities.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sandbox State
  const [sandboxParams, setSandboxParams] = useState<MLPredictionRequest>({
    marketingSpend: 1500,
    productPrice: 95,
    engagementScore: 72,
    supportTurnaround: 4,
    loyaltyCategory: "Silver"
  });
  const [sandboxPrediction, setSandboxPrediction] = useState<MLPredictionResponse | null>(null);
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  // Load and sync server health + dynamic documents
  const syncServerData = async () => {
    try {
      const hRes = await fetch("/api/health");
      if (hRes.ok) {
        const hData = await hRes.json();
        setServerHealth(hData);
      }

      const dRes = await fetch("/api/documents");
      if (dRes.ok) {
        const dData = await dRes.json();
        setDocuments(dData.map((d: any) => ({
          id: d.id,
          title: d.title,
          content: d.content,
          addedAt: d.addedAt,
          wordCount: d.content.split(/\s+/).length,
          sizeKb: Math.round((d.content.length / 1024) * 10) / 10
        })));
      }
    } catch (e) {
      console.warn("Server connection failed. Using state fallbacks for simulated offline use.", e);
    }
  };

  useEffect(() => {
    syncServerData();
  }, [activeTab]);

  useEffect(() => {
    // Keep chat scrolled
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Initial Sandbox prediction calculation
  useEffect(() => {
    calculatePrediction();
  }, [sandboxParams]);

  // Handle RAG Insights Generate
  const handleQueryRAG = async (customQuery?: string) => {
    const q = customQuery || ragQuery;
    if (!q.trim()) return;

    setIsRagLoading(true);
    setRagResult("");
    setRagSources([]);

    try {
      const res = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });

      if (res.ok) {
        const data = await res.json();
        setRagResult(data.insight);
        setRagSources(data.sources || []);
      } else {
        setRagResult("Error occurred while generating analytics insights. Please verify server status.");
      }
    } catch (err) {
      setRagResult("Direct server connection lost. Operating on cached state variables.");
    } finally {
      setIsRagLoading(false);
    }
  };

  // Handle Add Document to store
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newDocTitle, content: newDocContent })
      });

      if (res.ok) {
        setNewDocTitle("");
        setNewDocContent("");
        setShowAddDocForm(false);
        syncServerData();
      }
    } catch (err) {
      // Simulate locally if server offline
      const mockDoc: DocumentRecord = {
        id: `mock-${Date.now()}`,
        title: newDocTitle,
        content: newDocContent,
        addedAt: new Date().toISOString(),
        wordCount: newDocContent.split(/\s+/).length,
        sizeKb: Math.round((newDocContent.length / 1024) * 10) / 10
      };
      setDocuments(prev => [mockDoc, ...prev]);
      setNewDocTitle("");
      setNewDocContent("");
      setShowAddDocForm(false);
    }
  };

  // Send message to assistant
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistMsg]);
      }
    } catch (err) {
      // Offline local simulated response fallback
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: `### 🚀 Simulated Intel: Sandbox Direct Feedback\n\nI processed your request: "${text}" against the current business parameters.\n\nGiven your **Marketing Spend ($${sandboxParams.marketingSpend})** and **Product Pricing ($${sandboxParams.productPrice})**, we project stable conversions. However, increasing customer support sla target from **${sandboxParams.supportTurnaround} hrs** to under **3 hours** triggers positive feedback parameters that eliminate up to 12% in current standard tier churn rate.\n\nConfigure your \`GEMINI_API_KEY\` in the sidebar to activate unrestricted deep reasoning!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 700);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Compute live mathematical simulated sandbox predictions
  const calculatePrediction = async () => {
    setIsSandboxLoading(true);
    try {
      const res = await fetch("/api/ml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sandboxParams)
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxPrediction(data);
      }
    } catch (err) {
      // Local calculation fallback in case of connection loss
      const spend = sandboxParams.marketingSpend;
      const price = sandboxParams.productPrice;
      const eng = sandboxParams.engagementScore;
      const sla = sandboxParams.supportTurnaround;
      const cat = sandboxParams.loyaltyCategory;

      let conv = (spend / 1200) * 0.15 + (eng / 100) * 0.52 - (price / 220) * 0.12;
      let bonus = cat === 'VIP' ? 0.22 : cat === 'Gold' ? 0.12 : cat === 'Silver' ? 0.05 : 0;
      conv += bonus;
      const finalConv = Math.max(1, Math.min(99, Math.round(conv * 100)));

      let churn = (sla / 24) * 0.52 - (eng / 100) * 0.28 - bonus * 1.25 + 0.18;
      const finalChurn = Math.max(1, Math.min(98, Math.round(churn * 100)));

      const projValue = Math.round((spend * 2.5) * (eng / 80) * (price > 120 ? 0.88 : 1) * (1 + bonus));

      setSandboxPrediction({
        conversionProbability: finalConv,
        churnProbability: finalChurn,
        projectedSalesValue: projValue,
        shapValues: [
          { feature: "Marketing Spend", value: Math.round((spend - 500) * 0.04), effect: spend >= 500 ? "positive" : "negative", description: "Spend impact relative to base." },
          { feature: "Engagement Level", value: Math.round((eng - 60) * 0.6), effect: eng >= 60 ? "positive" : "negative", description: "Customer stickiness multiplier." },
          { feature: "Product Pricing", value: Math.round((75 - price) * 0.15), effect: price <= 75 ? "positive" : "negative", description: "Price elasticity contribution." },
          { feature: "Support SLA Time", value: Math.round((6 - sla) * 1.2), effect: sla <= 6 ? "positive" : "negative", description: "Support speed satisfaction." },
          { feature: "Loyalty Classification", value: cat === 'VIP' ? 22 : cat === 'Gold' ? 12 : cat === 'Silver' ? 5 : -4, effect: cat !== 'Standard' ? "positive" : "negative", description: "Segment resilience factor." }
        ]
      });
    } finally {
      setIsSandboxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/10">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-teal-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">InsightForge</h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">v2.5 Full-Stack</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">AI & Predictive Machine Learning Intelligence Platform</p>
          </div>
        </div>

        {/* Sync / Status Pills */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/50 rounded-full px-3 py-1 text-xs border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300 font-mono text-[11px]">
              {serverHealth?.hasGeminiKey ? "Gemini-3.5 Real-Time Active" : "Operational Fallback Mode Active"}
            </span>
          </div>

          <button 
            onClick={syncServerData}
            title="Refresh connection status"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* SUB HELPER BANNER FOR CREDENTIALS */}
      {!serverHealth?.hasGeminiKey && (
        <div className="bg-gradient-to-r from-amber-950/20 via-amber-900/15 to-transparent border-b border-amber-900/30 px-6 py-2.5 text-xs text-amber-300 flex items-center space-x-2 justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Operating in local simulations. To configure live intelligence model pipelines, supply your <strong>GEMINI_API_KEY</strong> in your Secrets panel.</span>
          </div>
          <span className="text-[10px] font-mono shrink-0 uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Ready to Upgrade</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col space-y-6">
        
        {/* SUB NAVIGATION TAB RAIL */}
        <nav className="flex flex-wrap p-1 gap-1.5 bg-slate-900/90 rounded-xl border border-slate-800 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-slate-950 text-teal-400 border border-slate-800 shadow shadow-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-950/40"
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>Interactive Dynamic Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-slate-950 text-teal-400 border border-slate-800 shadow shadow-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-950/40"
            }`}
          >
            <Bot className="h-4 w-4 shrink-0" />
            <span>AI Growth Agent Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("rag")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all duration-200 ${
              activeTab === "rag"
                ? "bg-slate-950 text-teal-400 border border-slate-800 shadow shadow-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-950/40"
            }`}
          >
            <Database className="h-4 w-4 shrink-0" />
            <span>RAG Document Library</span>
          </button>
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all duration-200 ${
              activeTab === "sandbox"
                ? "bg-slate-950 text-teal-400 border border-slate-800 shadow shadow-slate-950"
                : "text-slate-400 hover:text-white hover:bg-slate-950/40"
            }`}
          >
            <Sliders className="h-4 w-4 shrink-0" />
            <span>ML Predictive Simulator</span>
          </button>
        </nav>

        {/* SECTIONS VIEWPORT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* 1. INTERACTIVE DASHBOARD SECTION */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* METRIC CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {INITIAL_METRICS.map((metric) => {
                    const isPositive = metric.isPositive;
                    return (
                      <div
                        key={metric.id}
                        className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-tight">{metric.label}</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                            isPositive 
                              ? "bg-emerald-500/10 text-emerald-400" 
                              : "bg-red-500/11 text-red-400"
                          }`}>
                            {isPositive ? <TrendingUp className="h-3 w-3 inline mr-0.5" /> : <TrendingDown className="h-3 w-3 inline mr-0.5" />}
                            <span>{metric.change}</span>
                          </span>
                        </div>
                        <div className="flex items-baseline space-x-1.5 justify-between">
                          <span className="text-2xl font-bold text-white tracking-tight">{metric.value}</span>
                          <span className="text-[10px] font-mono text-slate-500">Real-Time</span>
                        </div>

                        {/* MINI MINI SPARKLINE GRID DESIGN */}
                        <div className="mt-4 h-6 w-full opacity-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metric.trendData.map((val, idx) => ({ idx, val }))}>
                              <Area
                                type="monotone"
                                dataKey="val"
                                stroke={isPositive ? "#10b981" : "#f43f5e"}
                                fill={isPositive ? "rgba(16,185,129,0.05)" : "rgba(244,63,94,0.05)"}
                                strokeWidth={1.5}
                                dot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CHARTS GRID SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* REVENUE VELOCITY CHART (AREA) */}
                  <div className="lg:col-span-2 bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white tracking-tight">Revenue Trajectory & Target Progress</h3>
                        <p className="text-xs text-slate-400">MoM organic subscription gains vs company targets</p>
                      </div>
                      <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                        Target Delta: +5.9%
                      </span>
                    </div>
                    <div className="h-72 w-full pr-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={HISTORICAL_SALES_DATA}>
                          <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                            labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Area type="monotone" name="Actual Performance ($)" dataKey="actual" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2.5} />
                          <Area type="monotone" name="Revenue Target ($)" dataKey="target" stroke="#6366f1" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* PIE CHART - LOYALTY CLIENT WEIGHTS */}
                  <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4 justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">CRM Client Segment Distribution</h3>
                      <p className="text-xs text-slate-400">Subscription accounts structured by loyalty status classification</p>
                    </div>

                    <div className="h-52 w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={LOYALTY_SEGMENTS_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {LOYALTY_SEGMENTS_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-white tracking-tight">4 Tiers</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Status Group</span>
                      </div>
                    </div>

                    {/* PIE LEGEND */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
                      {LOYALTY_SEGMENTS_DATA.map((entry) => (
                        <div key={entry.name} className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          <span className="text-slate-400">{entry.name}</span>
                          <span className="text-white font-semibold font-mono">{entry.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 1.2 OPERATIONAL INTELLIGENCE RESEARCH ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* SLA TURNAROUND VS CHURN CORRELATION */}
                  <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">Support SLA Turnaround vs Subscriber Churn Rate</h3>
                      <p className="text-xs text-slate-400">Target response SLA impacts on standard customer retention cohorts</p>
                    </div>
                    <div className="h-64 w-full pr-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={SLA_CHURN_CORRELATION_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis yAxisId="left" stroke="#2dd4bf" fontSize={11} tickLine={false} label={{ value: 'SLA (Hours)', angle: -90, position: 'insideLeft', fill: '#2dd4bf', style: { textAnchor: 'middle', fontSize: 10 } }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} tickLine={false} label={{ value: 'Churn Risk (%)', angle: 90, position: 'insideRight', fill: '#f43f5e', style: { textAnchor: 'middle', fontSize: 10 } }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Bar yAxisId="left" name="Avg SLA Time (Hrs)" dataKey="avgSlaHours" fill="#14b8a6" radius={[4, 4, 0, 0]} opacity={0.85} barSize={24} />
                          <Line yAxisId="right" name="Churn Probability (%)" type="monotone" dataKey="churnRate" stroke="#f43f5e" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-[11px] text-slate-500 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 leading-relaxed">
                      💡 <strong>Insight Strategy:</strong> Reducing SLA times under <strong className="text-teal-400">4.2 hours</strong> triggers a massive decay in cohort churn risk down to single digits.
                    </div>
                  </div>

                  {/* PRICING ELASTICITY & REVENUE OPTIMIZATION CURVE */}
                  <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">Subscription Pricing Elasticity & Revenue Model</h3>
                      <p className="text-xs text-slate-400">Correlation of tier prices with projected conversion rate offsets</p>
                    </div>
                    <div className="h-64 w-full pr-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PRICE_ELASTICITY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="price" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft', fill: '#10b981', style: { textAnchor: 'middle', fontSize: 10 } }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={11} tickLine={false} label={{ value: 'Rev. Multiplier (x)', angle: 90, position: 'insideRight', fill: '#6366f1', style: { textAnchor: 'middle', fontSize: 10 } }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" />
                          <Line yAxisId="left" name="Expected Conversion (%)" type="monotone" dataKey="expectedConversion" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          <Line yAxisId="right" name="Revenue Efficiency (x)" type="monotone" dataKey="revenueMultiplier" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-[11px] text-slate-500 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 leading-relaxed">
                      📊 <strong>Tactical Threshold:</strong> The pricing sweet spot peaks at <strong className="text-indigo-400">$105</strong> where high revenue multiplier optimizes margin gains relative to conversion fatigue.
                    </div>
                  </div>

                </div>

                {/* BOTTOM PERFORMANCE SPLIT */}
                <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Funnel Volumetrics by Channel</h3>
                    <p className="text-xs text-slate-400">Differentiating total leads against local conversion rate percentages</p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CHANNEL_PERFORMANCE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                        />
                        <Bar name="Lead Volume Units" dataKey="value" radius={[4, 4, 0, 0]}>
                          {CHANNEL_PERFORMANCE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-800/80 pt-4 text-xs">
                    {CHANNEL_PERFORMANCE_DATA.map((c) => (
                      <div key={c.name} className="p-2 rounded-lg bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-400 block mb-0.5">{c.name}</span>
                        <span className="text-slate-100 font-bold font-mono text-sm">{c.conversion}% conv.</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 2. CHAT AGENT SECTION */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              >
                {/* INSTRUCTION TIPS COLUMN */}
                <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-2 text-teal-400 font-semibold text-sm">
                      <Bot className="h-4 w-4" />
                      <span>Growth Consultation</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Our custom Business growth assistant understands customer turnaround tolerances, pricing tiers, and acquisition spends. 
                    </p>
                    <div className="border-t border-slate-800/80 pt-3 space-y-2">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">Tactical directives:</span>
                      <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
                        <li>Friction elimination</li>
                        <li>SLA alerts framework</li>
                        <li>Pricing & CAC targets</li>
                      </ul>
                    </div>
                  </div>

                  {/* MINI STATS PRESET */}
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-905 border-dashed border-slate-800 text-[11px] text-slate-400">
                    <span className="font-mono text-[9px] uppercase tracking-wider block text-slate-500 mb-1">Direct Data Integration</span>
                    Active Sandbox Params: Price: <strong className="text-slate-200">${sandboxParams.productPrice}</strong>, Turnaround: <strong className="text-slate-200">{sandboxParams.supportTurnaround}h</strong>. This state automatically informs the Chat Agent.
                  </div>
                </div>

                {/* MAIN CHAT BOT CHASSIS */}
                <div className="lg:col-span-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
                  
                  {/* BOT TITLE BAR */}
                  <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></div>
                      <span className="text-xs font-semibold text-white font-sans uppercase tracking-[0.06em]">Conversational Co-Analyst</span>
                    </div>
                    <button 
                      onClick={() => setMessages([messages[0]])}
                      className="text-slate-500 hover:text-red-400 text-xs transition px-2 py-1 rounded hover:bg-slate-900"
                    >
                      Clear Log
                    </button>
                  </div>

                  {/* MESSAGE BUBBLES AREA */}
                  <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/20">
                    {messages.map((m) => {
                      const isMe = m.role === "user";
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl p-4 text-sm leading-relaxed ${
                              isMe
                                ? "bg-gradient-to-tr from-teal-605 to-emerald-600 bg-teal-700 text-white"
                                : "bg-slate-900 text-slate-200 border border-slate-800"
                            }`}
                          >
                            {/* MARKDOWN CONVERSATION TEXT */}
                            <div className="space-y-2 whitespace-pre-wrap font-sans text-[13px] md:text-sm">
                              {m.content}
                            </div>
                            <span className="text-[10px] text-slate-400 block text-right mt-1.5 opacity-70">
                              {m.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* LOADING DOTS ASSISTANT */}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900 text-slate-300 rounded-xl px-4 py-3 border border-slate-800 flex items-center space-x-2">
                          <span className="text-xs text-slate-400 animate-pulse">InsightForge is calculating...</span>
                          <div className="flex space-x-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* PRESET CHIP TRAIL */}
                  <div className="px-4 py-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto bg-slate-950/40">
                    {SUGGESTED_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip.label)}
                        className="text-[11px] font-medium text-slate-400 hover:text-teal-350 hover:text-white bg-slate-900 hover:bg-slate-800/80 rounded-full px-3 py-1 border border-slate-800 transition shrink-0 inline-flex items-center space-x-1"
                      >
                        <ChevronRight className="h-3 w-3 text-teal-400 shrink-0" />
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* CHAT INPUT AREA */}
                  <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Input business query or optimization goal..."
                      className="flex-1 text-sm bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 placeholder:text-slate-500 font-sans"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="p-2.5 rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {/* 3. RAG LIBRARY SECTION */}
            {activeTab === "rag" && (
              <motion.div
                key="rag"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-6"
              >
                {/* LEFT CONSOLE: DOCUMENTS & ADDS */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* DOCS TITLE & MANAGER */}
                  <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DbIcon className="h-4 w-4 text-teal-400" />
                        <h3 className="text-sm font-semibold text-white tracking-tight">Active Vector Corpus</h3>
                      </div>
                      <button
                        onClick={() => setShowAddDocForm(!showAddDocForm)}
                        className="text-xs px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Index Text</span>
                      </button>
                    </div>

                    {/* NEW DOCUMENT INPUT FORM */}
                    {showAddDocForm && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        onSubmit={handleAddDocument}
                        className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3"
                      >
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Document Title (e.g., Marketing Matrix)"
                            value={newDocTitle}
                            onChange={(e) => setNewDocTitle(e.target.value)}
                            className="w-full text-xs bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <textarea
                            required
                            rows={4}
                            placeholder="Insert document content text lines here..."
                            value={newDocContent}
                            onChange={(e) => setNewDocContent(e.target.value)}
                            className="w-full text-xs bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500 font-sans leading-relaxed"
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-xs bg-teal-500 hover:bg-teal-404 text-slate-950 font-bold py-1.5 rounded transition"
                        >
                          Vector Index Entry
                        </button>
                      </motion.form>
                    )}

                    {/* DYNAMIC DOCUMENT LIST ROWS */}
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {documents.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-xs">
                          No documents currently indexed. Click 'Index Text' to initialize vector content.
                        </div>
                      ) : (
                        documents.map((doc) => (
                          <div 
                            key={doc.id}
                            className="bg-slate-950/40 hover:bg-slate-950 transition border border-slate-900 hover:border-slate-850 p-3 rounded-lg text-xs space-y-2 flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between space-x-2">
                              <span className="font-semibold text-slate-200 leading-tight">{doc.title}</span>
                              <span className="text-[9px] font-mono shrink-0 bg-slate-900 text-slate-400 px-1 py-0.5 rounded border border-slate-800">{doc.sizeKb} KB</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-[11px] line-clamp-2">{doc.content}</p>
                            <div className="border-t border-slate-900/60 pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                              <span>{doc.wordCount} words</span>
                              <span>Added {new Date(doc.addedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-teal-500/5 text-teal-400 p-3 rounded-lg border border-teal-500/10 text-[11px] flex items-start space-x-2">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>RAG automatically splits, scopes and matches query tokens against any and all entries listed here to synthesise targeted analyses.</span>
                    </div>

                  </div>

                </div>

                {/* RIGHT CONSOLE: SEARCH AND RESULT INSIGHTS */}
                <div className="lg:col-span-3 space-y-6">
                  
                  <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col h-full justify-between space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">RAG Generative Insight Search</h3>
                      <p className="text-xs text-slate-400">Query the entire document database to extract synthesized advice</p>
                    </div>

                    {/* SEARCH PINNED BAR */}
                    <div className="flex space-x-2 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      <input
                        type="text"
                        value={ragQuery}
                        onChange={(e) => setRagQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleQueryRAG()}
                        placeholder="Search: e.g. How do high turnaround SLA support limits impact pricing churn?"
                        className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:outline-none focus:ring-0 placeholder:text-slate-500 px-2"
                      />
                      <button
                        onClick={() => handleQueryRAG()}
                        className="bg-teal-500 text-slate-950 hover:bg-teal-404 font-semibold px-4 py-1.5 rounded text-xs transition flex items-center space-x-1"
                      >
                        <Search className="h-3 w-3" />
                        <span>Search</span>
                      </button>
                    </div>

                    {/* INSIGHT RESULT CARD */}
                    <div className="flex-1 bg-slate-950 rounded-lg p-5 border border-slate-900 h-[300px] overflow-y-auto leading-relaxed text-sm relative">
                      
                      {isRagLoading ? (
                        <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center space-y-2">
                          <span className="text-teal-400 animate-pulse text-xs tracking-wider">Retrieving and Synthesizing Documents...</span>
                          <span className="text-[10px] text-slate-500">Querying semantic embedding matches inside memory...</span>
                        </div>
                      ) : !ragResult ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 font-sans text-xs space-y-2">
                          <Sparkles className="h-6 w-6 text-slate-600 animate-pulse" />
                          <span>Retrieve knowledge matches by entering queries above.</span>
                          <p className="max-w-[300px] text-[11px] text-slate-600 leading-normal">
                            We will retrieve matching segments and execute Gemini RAG processing to compute key actions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* OUTPUT INSIGHT IN MARKDOWN */}
                          <div className="text-xs md:text-sm text-slate-200 whitespace-pre-wrap font-sans">
                            {ragResult}
                          </div>

                          {/* RELEVANT SOURCES DISPLAYED */}
                          {ragSources.length > 0 && (
                            <div className="pt-4 border-t border-slate-900/80 flex items-center flex-wrap gap-1.5">
                              <span className="text-[10px] text-slate-400 uppercase font-mono mr-1.5 font-bold">Matched:</span>
                              {ragSources.map((s, i) => (
                                <span key={i} className="text-[10px] font-mono bg-slate-900 text-teal-400 px-2 py-0.5 rounded border border-slate-800 flex items-center space-x-1">
                                  <FileText className="h-2.5 w-2.5 shrink-0 text-slate-500" />
                                  <span>{s}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* 4. ML PREDICTIVE SIMULATOR SECTION */}
            {activeTab === "sandbox" && (
              <motion.div
                key="sandbox"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-6"
              >
                {/* LEFT COLUMN: ACTIVE CONTROL PANEL (SLIDERS) */}
                <div className="lg:col-span-2 bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Predictive SLA Slider Overrides</h3>
                    <p className="text-xs text-slate-400">Manipulate business components to test churn & conversion probability weights</p>
                  </div>

                  {/* SLIDERS PORT */}
                  <div className="space-y-4">
                    
                    {/* SLIDER 1: MARKETING SPEND */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Marketing Spend (Ad channels)</span>
                        <span className="font-mono text-white font-bold">${sandboxParams.marketingSpend} / mo</span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="5040"
                        step="100"
                        value={sandboxParams.marketingSpend}
                        onChange={(e) => setSandboxParams(prev => ({ ...prev, marketingSpend: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>

                    {/* SLIDER 2: ENGAGEMENT SCORE */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Average User Engagement</span>
                        <span className="font-mono text-white font-bold">{sandboxParams.engagementScore} / 100</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={sandboxParams.engagementScore}
                        onChange={(e) => setSandboxParams(prev => ({ ...prev, engagementScore: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>

                    {/* SLIDER 3: PRODUCT PRICE */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Avg Subscription Price</span>
                        <span className="font-mono text-white font-bold">${sandboxParams.productPrice} / user</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="350"
                        step="5"
                        value={sandboxParams.productPrice}
                        onChange={(e) => setSandboxParams(prev => ({ ...prev, productPrice: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>

                    {/* SLIDER 4: SUPPORT TURNAROUND TIME */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Customer Support Turnaround</span>
                        <span className="font-mono text-white font-bold">{sandboxParams.supportTurnaround} hours</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="48"
                        step="1"
                        value={sandboxParams.supportTurnaround}
                        onChange={(e) => setSandboxParams(prev => ({ ...prev, supportTurnaround: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>

                    {/* DROPDOWN LOYALTY SELECT */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 block">Customer Loyalty Classification Group</label>
                      <select
                        value={sandboxParams.loyaltyCategory}
                        onChange={(e) => setSandboxParams(prev => ({ ...prev, loyaltyCategory: e.target.value as any }))}
                        className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-teal-500 font-medium"
                      >
                        <option value="Standard">Standard Account Segment</option>
                        <option value="Silver">Silver Tier Tier Segment</option>
                        <option value="Gold">Gold Circle Brand Advocates</option>
                        <option value="VIP">VIP Elite Group</option>
                      </select>
                    </div>

                  </div>

                  <div className="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-4 flex items-start space-x-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-indigo-400" />
                    <span>Calculations run instantly through our local ML prediction pipeline to compute SHAP game-theoretic force attribution values.</span>
                  </div>

                </div>

                {/* RIGHT COLUMN: PREDICTIVE METRICS AND SHAP ATTRIBUTION VISUALS */}
                <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                  
                  {/* METRIC GAUGE PROBABILITY CONTAINER */}
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* CONVERSION SPEEDOMETER */}
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-900 text-center flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Sales Conversion Probability</span>
                      <div className="py-2 flex items-baseline justify-center space-x-1.5">
                        <span className="text-3xl font-extrabold text-teal-400">{sandboxPrediction?.conversionProbability}%</span>
                        <span className="text-[10px] text-slate-500">Likelihood</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${sandboxPrediction?.conversionProbability}%` }}></div>
                      </div>
                    </div>

                    {/* ARR EXPECTANCY */}
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-900 text-center flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Projected Value Velocity</span>
                      <div className="py-2 flex items-baseline justify-center space-x-1">
                        <span className="text-2xl font-extrabold text-white">${sandboxPrediction?.projectedSalesValue?.toLocaleString()}</span>
                        <span className="text-[10px] text-indigo-400 uppercase">Gross</span>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">Combined elasticity scaling</div>
                    </div>

                    {/* CHURN DANGER CARD */}
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-900 text-center flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Expected Client Churn Rate</span>
                      <div className="py-2 flex items-baseline justify-center space-x-1.5">
                        <span className={`text-3xl font-extrabold ${sandboxPrediction && sandboxPrediction.churnProbability > 45 ? "text-rose-450 text-rose-500" : "text-emerald-400"}`}>
                          {sandboxPrediction?.churnProbability}%
                        </span>
                        <span className="text-[10px] text-slate-500">Danger Limit</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full ${sandboxPrediction && sandboxPrediction.churnProbability > 45 ? "bg-rose-500" : "bg-emerald-400"}`} style={{ width: `${sandboxPrediction?.churnProbability}%` }}></div>
                      </div>
                    </div>

                  </div>

                  {/* SHAP FORCE BREAKDOWN CHART */}
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase font-mono text-slate-400 leading-tight">ML Explainable SHAP Attribution breakdown</h4>
                      <p className="text-[11px] text-slate-500">Attributing real strength values that push risk levels higher (positive) vs lower (negative)</p>
                    </div>

                    {/* SHAP RANGE LEGEND LIST */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] scrollbar-thin mt-2">
                      {sandboxPrediction?.shapValues.map((sh, idx) => {
                        const isPos = sh.effect === "positive";
                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-300 font-semibold">{sh.feature}</span>
                              <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${isPos ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border border-rose-500/10"}`}>
                                {isPos ? `+${sh.value}% Influence` : `${sh.value}% Influence`}
                              </span>
                            </div>

                            {/* Attributed Bar Level */}
                            <div className="w-full h-3 bg-slate-950 rounded border border-slate-900 overflow-hidden flex relative">
                              <div className="h-full bg-slate-900 absolute top-0 left-1/2 w-0.5 z-10"></div>
                              {isPos ? (
                                <div className="h-full bg-gradient-to-r from-teal-521 from-teal-500 to-emerald-400 rounded-sm" style={{ width: `${Math.min(50, Math.max(1, sh.value))}%`, marginLeft: "50%" }}></div>
                              ) : (
                                <div className="h-full bg-gradient-to-l from-rose-500 to-red-651 rounded-sm ml-auto" style={{ width: `${Math.min(50, Math.max(1, Math.abs(sh.value)))}%`, marginRight: "50%" }}></div>
                              )}
                            </div>
                            <p className="text-[10.5px] text-slate-500 leading-normal pl-1 border-l border-slate-805">{sh.description}</p>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* LOWER FOOTER STATS SECTION */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-5 text-center text-xs text-slate-500 flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-2">
          <span>InsightForge Analytics</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-mono select-none">Analytics Sandbox Active</span>
        </div>
      </footer>

    </div>
  );
}
