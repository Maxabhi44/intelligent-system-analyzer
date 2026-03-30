import { motion } from "motion/react";
import { X, FileText, Clock, ShieldCheck, AlertTriangle, Trash2, FileX } from "lucide-react";

export function DetailPanel({ item, onClose }: any) {
  const isInsightCard = item.icon;
  
  return (
    <motion.aside
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="w-96 border-l border-white/5 bg-[#0F172A]/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Details</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isInsightCard ? (
          <InsightDetails item={item} />
        ) : (
          <FileDetails item={item} />
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-white/5 space-y-3">
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button className="w-full py-3 rounded-xl bg-white/5 text-white/80 font-medium hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2">
          <FileX className="w-4 h-4" />
          Ignore
        </button>
      </div>
    </motion.aside>
  );
}

function InsightDetails({ item }: any) {
  const Icon = item.icon;
  
  const colorClasses = {
    blue: { bg: "bg-blue-500/10", icon: "text-blue-400", border: "border-blue-500/20" },
    purple: { bg: "bg-purple-500/10", icon: "text-purple-400", border: "border-purple-500/20" },
    yellow: { bg: "bg-yellow-500/10", icon: "text-yellow-400", border: "border-yellow-500/20" },
    red: { bg: "bg-red-500/10", icon: "text-red-400", border: "border-red-500/20" },
  };

  const colors = colorClasses[item.color as keyof typeof colorClasses];

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center">
        <div className={`inline-flex p-6 rounded-3xl ${colors.bg} mb-4`}>
          <Icon className={`w-12 h-12 ${colors.icon}`} />
        </div>
        <h4 className="text-2xl font-semibold text-white mb-2">{item.title}</h4>
        <div className="text-3xl font-bold text-white/90 mb-1">{item.value}</div>
        <div className="text-white/50 text-sm">{item.count}</div>
      </div>

      {/* Confidence Score */}
      <div className={`glass-card p-4 rounded-2xl border ${colors.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">Confidence Level</span>
          <span className={`font-semibold ${colors.icon}`}>{item.confidence}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.confidence}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${
  item.confidence >= 80 ? 'bg-green-500' :
  item.confidence >= 50 ? 'bg-yellow-500' :
  'bg-red-500'
}`}
          />
        </div>
      </div>

      {/* Insight Explanation */}
      <div className="glass-card p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">Why This Matters</span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          {item.insight}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <DetailItem label="Category" value={item.title} />
        <DetailItem label="Impact" value="Medium" />
        <DetailItem label="Safety Level" value="Safe to clean" color="green" />
      </div>
    </div>
  );
}

function FileDetails({ item }: any) {
  // File type extension se nikalo
  const ext = item.name?.split('.').pop()?.toUpperCase() || "Unknown";
  const fileTypeMap: any = {
    "ZIP": "Compressed Archive",
    "EXE": "Executable Program",
    "MP4": "Video File",
    "MP3": "Audio File",
    "PDF": "PDF Document",
    "DAT": "Data File",
    "VHDX": "Virtual Disk Image",
    "BAT": "Batch Script",
    "MSI": "Installer Package",
    "LOG": "Log File",
    "TMP": "Temporary File",
    "JS": "JavaScript File",
    "TS": "TypeScript File",
    "JSON": "JSON Data File",
  };
  const fileType = fileTypeMap[ext] || `${ext} File`;

  // Last accessed format karo
  const lastAccessed = item.last_accessed
    ? new Date(item.last_accessed).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      })
    : "Never accessed";

  // Size
  const sizeMb = item.size_mb || 0;
  const sizeDisplay = sizeMb > 1024
    ? `${(sizeMb / 1024).toFixed(1)} GB`
    : `${sizeMb} MB`;

  // Safety — junk = safe, baki = review
  const isSafe = item.reason?.includes("cache") || item.reason?.includes("junk") || item.reason?.includes("temp");

  // AI Analysis — intelligent, file ke hisaab se
  const getAiAnalysis = () => {
  const lastModifiedStr = item.last_modified
    ? new Date(item.last_modified).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      })
    : null;

  const daysSinceAccess = item.last_accessed
    ? Math.floor((Date.now() - new Date(item.last_accessed).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const timeInfo = [
    lastModifiedStr ? `Last modified: ${lastModifiedStr}.` : null,
    daysSinceAccess !== null ? `Last accessed ${daysSinceAccess} days ago.` : null,
  ].filter(Boolean).join(" ");

  if (item.unused_days) {
    return `${timeInfo} This ${fileType.toLowerCase()} has not been accessed in ${item.unused_days} days and may no longer be needed. Review before deleting.`;
  }
  if (sizeMb > 1000) {
    return `${timeInfo} This is a large ${fileType.toLowerCase()} taking up ${sizeDisplay} of storage. If you no longer need it, deleting it will free significant space.`;
  }
  if (item.reason?.includes("cache") || item.reason?.includes("temp")) {
    return `${timeInfo} This is a temporary/cache file (${ext}). It was auto-generated and is safe to delete without affecting your data.`;
  }
  if (["EXE","BAT","MSI","CMD","PS1"].includes(ext)) {
    return `${timeInfo} This is an executable file (${ext}). Be careful — only delete if you are sure you no longer need this program or installer.`;
  }
  return `${timeInfo} This ${fileType.toLowerCase()} is flagged for review. Check if you still need it before deleting.`;
};

  return (
    <div className="space-y-6">
      {/* File Icon & Name */}
      <div className="text-center">
        <div className="inline-flex p-6 rounded-3xl bg-blue-500/10 mb-4">
          <FileText className="w-12 h-12 text-blue-400" />
        </div>
        <h4 className="text-lg font-semibold text-white mb-2 break-words">{item.name}</h4>
        <div className="text-2xl font-bold text-blue-400 mb-1">{sizeDisplay}</div>
      </div>

      {/* File Info */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div>
          <div className="text-white/40 text-xs mb-1">File Type</div>
          <div className="text-white text-sm">{fileType}</div>
        </div>
        <div>
          <div className="text-white/40 text-xs mb-1">Location</div>
          <div className="text-white/60 text-xs font-mono break-all">
            {item.path || item.group || "Unknown"}
          </div>
        </div>
        <div>
          <div className="text-white/40 text-xs mb-1">Last Accessed</div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="w-4 h-4 text-white/40" />
            {lastAccessed}
          </div>
        </div>
        {item.unused_days && (
          <div>
            <div className="text-white/40 text-xs mb-1">Unused For</div>
            <div className="text-yellow-400 text-sm font-medium">{item.unused_days} days</div>
          </div>
        )}
      </div>

      {/* AI Analysis — intelligent */}
      <div className="glass-card p-5 rounded-2xl border border-blue-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-white font-medium text-sm">AI Analysis</span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          {getAiAnalysis()}
        </p>
      </div>

      {/* Safety Assessment */}
      {isSafe ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
          <ShieldCheck className="w-6 h-6 text-green-400" />
          <div>
            <div className="text-green-400 font-medium text-sm">Safe to Delete</div>
            <div className="text-white/60 text-xs">Auto-generated file, safe to remove</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <div>
            <div className="text-yellow-400 font-medium text-sm">Review Recommended</div>
            <div className="text-white/60 text-xs">Please verify before deletion</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, color = "white" }: any) {
  const textColor = color === "green" ? "text-green-400" : "text-white";
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
      <span className="text-white/60 text-sm">{label}</span>
      <span className={`${textColor} text-sm font-medium`}>{value}</span>
    </div>
  );
}
