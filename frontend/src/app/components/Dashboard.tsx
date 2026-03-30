import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Trash2, 
  HardDrive, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useOutletContext } from "react-router";
import { getSummary, trashAllFiles } from "../../api";

export function Dashboard() {
  const [progress, setProgress] = useState(0);
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

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => setProgress(92), 300);
    return () => clearTimeout(timer);
  }, []);

  const systemStatus = {
    level: "good", // good | warning | critical
    score: 92,
    message: "System running optimally"
  };

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
    {
      id: 1,
      icon: Trash2,
      title: "Junk Files",
      value: "Scanning...",
      count: "",
      insight: "Loading data from backend...",
      color: "blue",
      action: "Clean",
      confidence: 0
    },
    {
      id: 2,
      icon: HardDrive,
      title: "Large Files",
      value: "Scanning...",
      count: "",
      insight: "Loading data from backend...",
      color: "purple",
      action: "Review",
      confidence: 0
    },
    {
      id: 3,
      icon: Clock,
      title: "Unused Files",
      value: "Scanning...",
      count: "",
      insight: "Loading data from backend...",
      color: "yellow",
      action: "Review",
      confidence: 0
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: "Risky Files",
      value: "Scanning...",
      count: "",
      insight: "Loading data from backend...",
      color: "red",
      action: "Review",
      confidence: 0
    }
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">System Status</h2>
        <p className="text-white/50">Last scan: Today at 2:35 PM</p>
      </div>

      {/* Status Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-12">
            {/* Circular Progress */}
            <div className="relative">
              <CircularProgress value={progress} size={180} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white mb-1">{systemStatus.score}</div>
                <div className="text-sm text-white/50">Health Score</div>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {systemStatus.level === "good" && (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-semibold text-green-500">Excellent</span>
                  </>
                )}
                {systemStatus.level === "warning" && (
                  <>
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                    <span className="text-2xl font-semibold text-yellow-500">Needs Attention</span>
                  </>
                )}
              </div>
              <p className="text-white/70 text-lg mb-6">{systemStatus.message}</p>
              
              <div className="space-y-3">
                <StatItem icon={TrendingUp} label="Performance" value="Optimal" color="green" />
                <StatItem icon={HardDrive} label="Storage Health" value="92% Clean" color="blue" />
                <StatItem icon={CheckCircle2} label="Security Status" value="Protected" color="green" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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

function CircularProgress({ value, size }: { value: number; size: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.05)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          strokeDasharray: circumference,
        }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatItem({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    green: "text-green-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
  };

  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${colorClasses[color as keyof typeof colorClasses]}`} />
      <span className="text-white/60 text-sm">{label}:</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}

function InsightCard({ item, index, onClick }: any) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
      icon: "text-blue-400"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      icon: "text-purple-400"
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      glow: "shadow-yellow-500/20",
      icon: "text-yellow-400"
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      glow: "shadow-red-500/20",
      icon: "text-red-400"
    },
  };

  const colors = colorClasses[item.color as keyof typeof colorClasses];
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
    if(item.action === "Clean") {
  if(window.confirm(`Kya aap saare ${item.count} junk files delete karna chahte ho? Yeh trash mein jayenge — undo kar sakte ho.`)) {
    try {
      const summary = await getSummary("C:/Users/maxab/Downloads");
      const paths = summary.junk_files.files.map((f: any) => f.path);
      await trashAllFiles(paths);
      alert(`${paths.length} files trash mein gayi! ✅`);
      window.location.reload();
    } catch(err) {
      alert("Error aaya — backend chal raha hai?");
    }
  }
  return;
}
if(item.action === "Review") {
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
