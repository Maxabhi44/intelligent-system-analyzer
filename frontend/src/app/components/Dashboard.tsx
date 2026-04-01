import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trash2, HardDrive, Clock, AlertTriangle,
  TrendingUp, ShieldCheck, X, Eye, Zap,
} from "lucide-react";
import { useOutletContext } from "react-router";
import { getSummary, trashAllFiles } from "../../api";

export function Dashboard() {
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [cleaning, setCleaning] = useState(false);

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

  const scores = scanData?.scores ?? {
    performance: { score: 0, status: "Loading...", tip: null },
    storage: { score: 0, status: "Loading...", tip: null },
    security: { score: 0, status: "Loading...", tip: null },
  };

  const statusLines: string[] = scanData?.status_lines ?? ["Loading system data..."];
  const performanceSubtitle = scanData
    ? `${scanData.junk_files.count} junk files detected`
    : "Loading...";
  const storageSubtitle = scanData
    ? `${(scanData.large_files.size_mb / 1024).toFixed(1)}GB in large files`
    : "Loading...";
  const securitySubtitle = scanData
    ? `${scanData.risky_files.count} executable files found`
    : "Loading...";

  const handleDirectClean = async () => {
    setCleaning(true);
    try {
      const summary = await getSummary("C:/Users/maxab/Downloads");
      const paths = summary.junk_files.files.map((f: any) => f.path);
      await trashAllFiles(paths);
      setShowCleanModal(false);
      alert(`${paths.length} files trash mein gayi! ✅`);
      window.location.reload();
    } catch (err) {
      alert("Error aaya — backend chal raha hai?");
    } finally {
      setCleaning(false);
    }
  };

  const insights = scanData
    ? [
        {
          id: 1, icon: Trash2, title: "Junk Files",
          value:
            scanData.junk_files.size_mb > 1024
              ? `${(scanData.junk_files.size_mb / 1024).toFixed(1)} GB`
              : `${scanData.junk_files.size_mb.toFixed(0)} MB`,
          count: `${scanData.junk_files.count} files`,
          rawCount: scanData.junk_files.count,
          insight: "Temporary cache and system files taking up space",
          affects: "Performance Score", color: "blue", action: "Clean", confidence: 95,
        },
        {
          id: 2, icon: HardDrive, title: "Large Files",
          value: `${(scanData.large_files.size_mb / 1024).toFixed(1)} GB`,
          count: `${scanData.large_files.count} files`,
          insight: "Files over 100MB that you might want to review",
          affects: "Storage Score", color: "purple", action: "Review", confidence: 88,
        },
        {
          id: 3, icon: Clock, title: "Unused Files",
          value: `${scanData.unused_files.count} files`,
          count: `${scanData.unused_files.count} files`,
          insight: "Not accessed in the last 90 days",
          affects: "Storage Score", color: "yellow", action: "Review", confidence: 82,
        },
        {
          id: 4, icon: AlertTriangle, title: "Risky Files",
          value: `${scanData.risky_files.count} files`,
          count: `${scanData.risky_files.count} files`,
          insight: "Executables & scripts — verify before keeping",
          affects: "Security Score", color: "red", action: "Review", confidence: 78,
        },
      ]
    : [
        { id: 1, icon: Trash2,         title: "Junk Files",   value: "Scanning...", count: "", rawCount: 0, insight: "Loading...", affects: "Performance Score", color: "blue",   action: "Clean",  confidence: 0 },
        { id: 2, icon: HardDrive,       title: "Large Files",  value: "Scanning...", count: "",             insight: "Loading...", affects: "Storage Score",      color: "purple", action: "Review", confidence: 0 },
        { id: 3, icon: Clock,           title: "Unused Files", value: "Scanning...", count: "",             insight: "Loading...", affects: "Storage Score",      color: "yellow", action: "Review", confidence: 0 },
        { id: 4, icon: AlertTriangle,   title: "Risky Files",  value: "Scanning...", count: "",             insight: "Loading...", affects: "Security Score",     color: "red",    action: "Review", confidence: 0 },
      ];

  const junkItem = insights[0];

  return (
    <div
      className="min-h-full flex flex-col"
      style={{
        padding: "var(--content-padding)",
        gap: "var(--space-md)",
      }}
    >
      {/* Header */}
      <div className="shrink-0">
        <h2
          className="font-semibold text-white leading-tight"
          style={{ fontSize: "var(--text-xl)" }}
        >
          System Status
        </h2>
        <p
          className="text-white/50"
          style={{ fontSize: "var(--text-xs)" }}
        >
          Last scan: Today at 2:35 PM
        </p>
      </div>

      {/* 3 Score Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 shrink-0"
        style={{ gap: "var(--space-sm)" }}
      >
        <ScoreCard
          icon={TrendingUp} label="Performance"
          score={scores.performance.score} status={scores.performance.status}
          subtitle={performanceSubtitle} color="blue"
        />
        <ScoreCard
          icon={HardDrive} label="Storage"
          score={scores.storage.score} status={scores.storage.status}
          subtitle={storageSubtitle} color="purple"
        />
        <ScoreCard
          icon={ShieldCheck} label="Security"
          score={scores.security.score} status={scores.security.status}
          subtitle={securitySubtitle} color="green"
        />
      </motion.div>

      {/* Status Lines */}
      {statusLines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-xl shrink-0"
          style={{
            paddingLeft: "var(--space-md)",
            paddingRight: "var(--space-md)",
            paddingTop: "var(--space-sm)",
            paddingBottom: "var(--space-sm)",
          }}
        >
          {statusLines.map((line, i) => (
            <p
              key={i}
              className="text-white/70"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {line}
            </p>
          ))}
        </motion.div>
      )}

      {/* Insights Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3
          className="font-semibold text-white shrink-0"
          style={{
            fontSize: "var(--text-md)",
            marginBottom: "var(--space-sm)",
          }}
        >
          Intelligent Insights
        </h3>
        <div
          className="grid grid-cols-2 flex-1 min-h-0"
          style={{ gap: "var(--space-sm)" }}
        >
          {insights.map((item, index) => (
            <InsightCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => setSelectedItem(item)}
              onClean={() => setShowCleanModal(true)}
            />
          ))}
        </div>
      </div>

      {/* Clean Modal */}
      <AnimatePresence>
        {showCleanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            style={{ padding: "var(--space-md)" }}
            onClick={() => setShowCleanModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-3xl w-full max-w-md"
              style={{ padding: "var(--space-xl)" }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "var(--space-lg)" }}
              >
                <div
                  className="flex items-center"
                  style={{ gap: "var(--space-sm)" }}
                >
                  <div
                    className="rounded-xl bg-blue-500/10"
                    style={{ padding: "var(--space-xs)" }}
                  >
                    <Trash2
                      className="text-blue-400"
                      style={{
                        width: "var(--icon-md)",
                        height: "var(--icon-md)",
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold"
                      style={{ fontSize: "var(--text-lg)" }}
                    >
                      Junk Files
                    </h3>
                    <p
                      className="text-white/40"
                      style={{ fontSize: "var(--text-xs)" }}
                    >
                      {junkItem.value} • {junkItem.count}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCleanModal(false)}
                  className="rounded-xl hover:bg-white/5 transition-colors"
                  style={{ padding: "var(--space-xs)" }}
                >
                  <X
                    className="text-white/40"
                    style={{
                      width: "var(--icon-md)",
                      height: "var(--icon-md)",
                    }}
                  />
                </button>
              </div>

              {/* Modal Body */}
              <p
                className="text-white/60 leading-relaxed"
                style={{
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                You can review these files in{" "}
                <span className="text-blue-400 font-medium">Smart File View</span>{" "}
                before cleaning, or clean them directly. All files will go to
                trash — you can undo this action.
              </p>

              {/* Modal Actions */}
              <div
                className="flex flex-col"
                style={{ gap: "var(--space-sm)" }}
              >
                <button
                  onClick={() => {
                    setShowCleanModal(false);
                    window.location.href = "/files?category=junk";
                  }}
                  className="w-full rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium flex items-center justify-center hover:bg-blue-500/20 transition-all"
                  style={{
                    paddingTop: "var(--btn-py)",
                    paddingBottom: "var(--btn-py)",
                    fontSize: "var(--text-sm)",
                    gap: "var(--space-xs)",
                  }}
                >
                  <Eye style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
                  Go to Smart File View
                </button>

                <button
                  onClick={handleDirectClean}
                  disabled={cleaning}
                  className="w-full rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium flex items-center justify-center hover:bg-red-500/20 transition-all disabled:opacity-50"
                  style={{
                    paddingTop: "var(--btn-py)",
                    paddingBottom: "var(--btn-py)",
                    fontSize: "var(--text-sm)",
                    gap: "var(--space-xs)",
                  }}
                >
                  <Zap style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
                  {cleaning ? "Cleaning..." : "Clean Directly"}
                </button>

                <button
                  onClick={() => setShowCleanModal(false)}
                  className="w-full rounded-2xl text-white/30 hover:text-white/50 transition-colors"
                  style={{
                    paddingTop: "var(--btn-py)",
                    paddingBottom: "var(--btn-py)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Score Card ───────────────────────────────────────────────────────────────

function ScoreCard({ icon: Icon, label, score, status, subtitle, color }: any) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const colorMap: any = {
    blue:   { text: "text-blue-400",   stroke: "#3B82F6", bg: "bg-blue-500/10",   icon: "text-blue-400"   },
    purple: { text: "text-purple-400", stroke: "#8B5CF6", bg: "bg-purple-500/10", icon: "text-purple-400" },
    green:  { text: "text-green-400",  stroke: "#22C55E", bg: "bg-green-500/10",  icon: "text-green-400"  },
  };

  const c = colorMap[color];
  const statusColor =
    score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div
      className="glass-card rounded-2xl flex flex-col items-center"
      style={{
        padding: "var(--card-padding)",
        gap: "var(--space-xs)",
      }}
    >
      {/* Icon */}
      <div
        className={`rounded-xl ${c.bg}`}
        style={{ padding: "var(--space-xs)" }}
      >
        <Icon
          className={c.icon}
          style={{
            width: "var(--icon-md)",
            height: "var(--icon-md)",
          }}
        />
      </div>

      {/* Label */}
      <p
        className="text-white/60 font-medium"
        style={{ fontSize: "var(--text-xs)" }}
      >
        {label}
      </p>

      {/* Animated Circle */}
      <div className="relative" style={{ width: "var(--circle-size)", height: "var(--circle-size)" }}>
        <MiniCircle value={animatedScore} strokeColor={c.stroke} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${c.text}`}
            style={{ fontSize: "var(--text-lg)" }}
          >
            {score}
          </span>
        </div>
      </div>

      {/* Status */}
      <span
        className={`font-semibold ${statusColor}`}
        style={{ fontSize: "var(--text-xs)" }}
      >
        {status}
      </span>

      {/* Subtitle */}
      <p
        className="text-white/30 text-center leading-tight"
        style={{ fontSize: "var(--text-xs)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ─── Mini Circle ──────────────────────────────────────────────────────────────

function MiniCircle({ value, strokeColor }: { value: number; strokeColor: string }) {
  // Uses --circle-size and --circle-stroke CSS tokens for sizing
  // Rendered at a fixed internal resolution; CSS scales the SVG via width/height tokens
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
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

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({ item, index, onClick, onClean }: any) {
  const colorClasses: any = {
    blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   text: "text-blue-400",   glow: "shadow-blue-500/20",   icon: "text-blue-400"   },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/20", icon: "text-purple-400" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", glow: "shadow-yellow-500/20", icon: "text-yellow-400" },
    red:    { bg: "bg-red-500/10",    border: "border-red-500/20",    text: "text-red-400",    glow: "shadow-red-500/20",    icon: "text-red-400"    },
  };

  const colors = colorClasses[item.color];
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={onClick}
      className={`glass-card h-full rounded-2xl border ${colors.border} cursor-pointer transition-all duration-300 hover:shadow-xl ${colors.glow} flex flex-col justify-between`}
      style={{ padding: "var(--card-padding)" }}
    >
      {/* Top Section */}
      <div>
        {/* Icon + Confidence */}
        <div
          className="flex items-start justify-between"
          style={{ marginBottom: "var(--space-xs)" }}
        >
          <div
            className={`rounded-xl ${colors.bg}`}
            style={{ padding: "var(--space-xs)" }}
          >
            <Icon
              className={colors.icon}
              style={{
                width: "var(--icon-sm)",
                height: "var(--icon-sm)",
              }}
            />
          </div>

          <div className="flex flex-col items-end" style={{ gap: "var(--space-xs)" }}>
            <span
              className="text-white/50"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {item.confidence}% confident
            </span>
            <div className="w-16 h-1 rounded-full bg-white/10">
              <div
                className={`h-1 rounded-full ${
                  item.confidence >= 85
                    ? "bg-green-500"
                    : item.confidence >= 70
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${item.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-white"
          style={{
            fontSize: "var(--text-md)",
            marginBottom: "var(--space-xs)",
          }}
        >
          {item.title}
        </h3>

        {/* Value + Count */}
        <div
          className="flex items-baseline"
          style={{
            gap: "var(--space-xs)",
            marginBottom: "var(--space-xs)",
          }}
        >
          <span
            className={`font-bold ${colors.text}`}
            style={{ fontSize: "var(--text-xl)" }}
          >
            {item.value}
          </span>
          <span
            className="text-white/50"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {item.count}
          </span>
        </div>

        {/* Insight */}
        <p
          className="text-white/60 leading-snug"
          style={{
            fontSize: "var(--text-sm)",
            marginBottom: "var(--space-xs)",
          }}
        >
          {item.insight}
        </p>

        {/* Affects */}
        <p
          className="text-white/30"
          style={{ fontSize: "var(--text-xs)" }}
        >
          ↳ Affects {item.affects}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (item.action === "Clean") {
            onClean();
            return;
          }
          if (item.action === "Review") {
            const categoryMap: any = {
              "Large Files": "large",
              "Unused Files": "unused",
              "Risky Files": "risky",
              "Junk Files": "junk",
            };
            window.location.href = `/files?category=${categoryMap[item.title] || "junk"}`;
          }
        }}
        className={`w-full rounded-xl ${colors.bg} ${colors.text} font-medium transition-all duration-200 hover:brightness-125`}
        style={{
          marginTop: "var(--space-sm)",
          paddingTop: "var(--btn-py-sm)",
          paddingBottom: "var(--btn-py-sm)",
          fontSize: "var(--text-sm)",
        }}
      >
        {item.action}
      </button>
    </motion.div>
  );
}