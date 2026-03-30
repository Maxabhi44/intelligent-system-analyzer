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
            className={`h-full ${colors.bg.replace('/10', '/30')} rounded-full`}
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
  return (
    <div className="space-y-6">
      {/* File Icon & Name */}
      <div className="text-center">
        <div className="inline-flex p-6 rounded-3xl bg-blue-500/10 mb-4">
          <FileText className="w-12 h-12 text-blue-400" />
        </div>
        <h4 className="text-lg font-semibold text-white mb-2 break-words">{item.name}</h4>
        <div className="text-2xl font-bold text-blue-400 mb-1">{item.size}</div>
      </div>

      {/* File Info */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div>
          <div className="text-white/40 text-xs mb-1">File Type</div>
          <div className="text-white text-sm">Temporary Cache File</div>
        </div>
        <div>
          <div className="text-white/40 text-xs mb-1">Location</div>
          <div className="text-white/60 text-xs font-mono break-all">
            {item.group || "/System/Library/Caches"}
          </div>
        </div>
        <div>
          <div className="text-white/40 text-xs mb-1">Last Accessed</div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="w-4 h-4 text-white/40" />
            {item.lastUsed}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="glass-card p-5 rounded-2xl border border-blue-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-white font-medium text-sm">AI Analysis</span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          This is a temporary cache file created by the system. It has not been used for {item.lastUsed}. 
          Based on our analysis, this file is safe to delete and will help free up storage space without 
          affecting your system's functionality.
        </p>
      </div>

      {/* Safety Assessment */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
        <ShieldCheck className="w-6 h-6 text-green-400" />
        <div>
          <div className="text-green-400 font-medium text-sm">Safe to Delete</div>
          <div className="text-white/60 text-xs">92% confidence</div>
        </div>
      </div>

      {/* Warning if not safe */}
      {!item.safe && (
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
