import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Trash2, 
  HardDrive, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useOutletContext } from "react-router";
import { getSummary, trashAllFiles } from "../../api";

export function Dashboard() {
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSummary("C:/Users/maxab/Downloads");
        setScanData(data);
      } catch (err) {
        console.error("Backend se data nahi aaya:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { setSelectedItem } = useOutletContext<any>();

  // 3 scores backend se
  const scores = scanData?.scores ?? {
    performance: { score: 0, status: "Loading...", tip: null },
    storage: { score: 0, status: "Loading...", tip: null },
    security: { score: 0, status: "Loading...", tip: null },
  };

  const statusLines: string[] = scanData?.status_lines ?? ["Loading system data..."];

  const insights = scanData ? [
    {
      id: 1,
      icon: Trash2,
      title: "Junk Files",
      value: scanData.junk_files.size_mb > 1024 
        ? `${(scanData.junk_files.size_mb / 1024).toFixed(1)} GB`
        : `${scanData.junk_files.size_mb.toFixed(0)} MB`,
      count: `${scanData.junk_files.count} files`,
      insight: "Temporary cache and system files taking up space",
      color: "blue",
      action: "Clean",
      confidence: 95
    },
    {
      id: 2,
      icon: HardDrive,
      title: "Large Files",
      value: `${(scanData.large_files.size_mb / 1024).toFixed(1)} GB`,
      count: `${scanData.large_files.count} files`,
      insight: "Files over 100MB that you might want to review",
      color: "purple",
      action: "Review",
      confidence: 88
    },
    {
      id: 3,
      icon: Clock,
      title: "Unused Files",
      value: `${scanData.unused_files.count} files`,
      count: `${scanData.unused_files.count} files`,
      insight: "Not accessed in the last 90 days",
      color: "yellow",
      action: "Review",
      confidence: 82
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: "Risky Files",
      value: `${scanData.risky_files.count} files`,
      count: `${scanData.risky_files.count} files`,
      insight: "Executables & scripts — verify before keeping",
      color: "red",
      action: "Review",
      confidence: 78
    }
  ] : [
    { id: 1, icon: Trash2, title: "Junk Files", value: "Scanning...", count: "", insight: "Loading...", color: "blue", action: "Clean", confidence: 0 },
    { id: 2, icon: HardDrive, title: "Large Files", value: "Scanning...", count: "", insight: "Loading...", color: "purple", action: "Review", confidence: 0 },
    { id: 3, icon: Clock, title: "Unused Files", value: "Scanning...", count: "", insight: "Loading...", color: "yellow", action: "Review", confidence: 0 },
    { id: 4, icon: AlertTriangle, title: "Risky Files", value: "Scanning...", count: "", insight: "Loading...", color: "red", action: "Review", confidence: 0 },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">System Status</h2>
        <p className="text-white/50">Last scan: Today at 2:35 PM</p>
      </div>

      {/* 3 Score Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        <ScoreCard
          icon={TrendingUp}
          label="Performance"
          score={scores.performance.score}
          status={scores.performance.status}
          color="blue"
        />
        <ScoreCard
          icon={HardDrive}
          label="Storage"
          score={scores.storage.score}
          status={scores.storage.status}
          color="purple"
        />
        <ScoreCard
          icon={ShieldCheck}
          label="Security"
          score={scores.security.score}
          status={scores.security.status}
          color="green"
        />
      </motion.div>

      {/* Status Lines */}
      {statusLines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-5 rounded-2xl mb-8 space-y-2"
        >
          {statusLines.map((line, i) => (
            <p key={i} className="text-white/80 text-sm">{line}</p>
          ))}
        </motion.div>
      )}

      {/* Insights Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Intelligent Insights</h3>
        <div className="grid grid-cols-2 gap-6">
          {insights.map((item, index) => (
            <InsightCard 
              key={item.id} 
              item={item} 
              index={index}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Score Card Component ---
function ScoreCard({ icon: Icon, label, score, status, color }: any) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const colorMap: any = {
    blue: { text: "text-blue-400", stroke: "#3B82F6", bg: "bg-blue-500/10", icon: "text-blue-400" },
    purple: { text: "text-purple-400", stroke: "#8B5CF6", bg: "bg-purple-500/10", icon: "text-purple-400" },
    green: { text: "text-green-400", stroke: "#22C55E", bg: "bg-green-500/10", icon: "text-green-400" },
  };

  const c = colorMap[color];
  const statusColor =
    score >= 80 ? "text-green-400" :
    score >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="glass-card p-6 rounded-3xl flex flex-col items-center gap-4">
      <div className={`p-3 rounded-2xl ${c.bg}`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <p className="text-white/60 text-sm font-medium">{label}</p>

      <div className="relative">
        <MiniCircle value={animatedScore} strokeColor={c.stroke} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${c.text}`}>{score}</span>
        </div>
      </div>

      <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
    </div>
  );
}

function MiniCircle({ value, strokeColor }: { value: number; strokeColor: string }) {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
}

// --- Insight Card Component ---
function InsightCard({ item, index, onClick }: any) {
  const colorClasses: any = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/20", icon: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/20", icon: "text-purple-400" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", glow: "shadow-yellow-500/20", icon: "text-yellow-400" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", glow: "shadow-red-500/20", icon: "text-red-400" },
  };

  const colors = colorClasses[item.color];
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className={`glass-card p-6 rounded-3xl border ${colors.border} cursor-pointer transition-all duration-300 hover:shadow-xl ${colors.glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-white/50">{item.confidence}% confident</span>
          <div className="w-24 h-1.5 rounded-full bg-white/10">
            <div
              className={`h-1.5 rounded-full ${
                item.confidence >= 85 ? "bg-green-500" :
                item.confidence >= 70 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${item.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-3xl font-bold ${colors.text}`}>{item.value}</span>
        <span className="text-sm text-white/50">{item.count}</span>
      </div>
      <p className="text-white/60 text-sm mb-4 leading-relaxed">{item.insight}</p>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          if (item.action === "Clean") {
            if (window.confirm(`Kya aap saare ${item.count} junk files delete karna chahte ho? Yeh trash mein jayenge — undo kar sakte ho.`)) {
              try {
                const summary = await getSummary("C:/Users/maxab/Downloads");
                const paths = summary.junk_files.files.map((f: any) => f.path);
                await trashAllFiles(paths);
                alert(`${paths.length} files trash mein gayi! ✅`);
                window.location.reload();
              } catch (err) {
                alert("Error aaya — backend chal raha hai?");
              }
            }
            return;
          }
          if (item.action === "Review") {
            const categoryMap: any = {
              "Large Files": "large",
              "Unused Files": "unused",
              "Risky Files": "risky",
              "Junk Files": "junk",
            };
            const cat = categoryMap[item.title] || "junk";
            window.location.href = `/files?category=${cat}`;
          }
        }}
        className={`w-full py-2.5 rounded-xl ${colors.bg} ${colors.text} font-medium text-sm transition-all duration-200 hover:brightness-125`}
      >
        {item.action}
      </button>
    </motion.div>
  );
}