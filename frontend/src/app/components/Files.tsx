import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, FileText, Package, Calendar, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useOutletContext, useSearchParams } from "react-router";
import { getSummary, trashFile } from "../../api";

export function Files() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const { setSelectedItem } = useOutletContext<any>();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSummary("C:/Users/maxab/Downloads");
        setScanData(data);

        // Category filter ke hisaab se expand karo
        if (categoryFilter) {
          setExpandedGroups([categoryFilter]);
        } else {
          setExpandedGroups(["junk"]);
        }
      } catch (err) {
        console.error("Backend se data nahi aaya:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFilter]);

  const handleDelete = async (filePath: string) => {
    setDeletingFile(filePath);
    try {
      const result = await trashFile(filePath);
      if (result.success) {
        // Scan dobara karo updated data ke liye
        const data = await getSummary("C:/Users/maxab/Downloads");
        setScanData(data);
        alert(`File trash mein gayi! Undo kar sakte ho. ID: ${result.trash_id}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingFile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-white/50 text-lg">Scanning files...</div>
      </div>
    );
  }

  const fileGroups = scanData ? [
    {
      id: "junk",
      title: "Junk Files",
      icon: FileText,
      color: "blue",
      size: scanData.junk_files.size_mb > 1024
        ? `${(scanData.junk_files.size_mb / 1024).toFixed(1)} GB`
        : `${scanData.junk_files.size_mb.toFixed(0)} MB`,
      count: scanData.junk_files.count,
      description: "Temporary cache and junk files safe to remove",
      confidence: 95,
      files: scanData.junk_files.files.slice(0, 10),
      canAutoClean: true,
    },
    {
      id: "large",
      title: "Large Files",
      icon: Package,
      color: "purple",
      size: `${(scanData.large_files.size_mb / 1024).toFixed(1)} GB`,
      count: scanData.large_files.count,
      description: "Files over 100MB — review before deleting",
      confidence: 88,
      files: scanData.large_files.files.slice(0, 10),
      canAutoClean: false,
    },
    {
      id: "unused",
      title: "Unused Files",
      icon: Calendar,
      color: "yellow",
      size: `${scanData.unused_files.count} files`,
      count: scanData.unused_files.count,
      description: "Not accessed in the last 90 days",
      confidence: 82,
      files: scanData.unused_files.files.slice(0, 10),
      canAutoClean: false,
    },

    {
  id: "risky",
  title: "Risky Files",
  icon: AlertTriangle,
  color: "red",
  size: `${scanData.risky_files.count} files`,
  count: scanData.risky_files.count,
  description: "Executables & scripts — verify before keeping",
  confidence: 78,
  files: scanData.risky_files.files.slice(0, 10),
  canAutoClean: false,
},
  ] : [];

  // Category filter ke hisaab se order change karo
  const orderedGroups = categoryFilter
    ? [...fileGroups].sort((a, b) =>
        a.id === categoryFilter ? -1 : b.id === categoryFilter ? 1 : 0
      )
    : fileGroups;

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Smart File View</h2>
        <p className="text-white/50">
          {categoryFilter
            ? `Showing: ${fileGroups.find(g => g.id === categoryFilter)?.title}`
            : "Files organized by intelligent insights"}
        </p>
      </div>

      {/* Summary Stats */}
      {scanData && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Files" value={scanData.total_files.toLocaleString()} sublabel="in Downloads" />
          <StatCard
            label="Large Files"
            value={`${(scanData.large_files.size_mb / 1024).toFixed(1)} GB`}
            sublabel={`${scanData.large_files.count} files`}
            color="yellow"
          />
          <StatCard
            label="Junk Files"
            value={`${scanData.junk_files.size_mb.toFixed(0)} MB`}
            sublabel={`${scanData.junk_files.count} files`}
            color="green"
          />
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8 p-4 glass-card rounded-2xl">
        <StepItem number={1} label="Scan" done={true} />
        <div className="flex-1 h-px bg-white/10" />
        <StepItem number={2} label="Review" active={true} />
        <div className="flex-1 h-px bg-white/10" />
        <StepItem number={3} label="Clean" />
      </div>

      {/* File Groups */}
      <div className="space-y-4">
        {orderedGroups.map((group) => (
          <FileGroup
            key={group.id}
            group={group}
            isExpanded={expandedGroups.includes(group.id)}
            onToggle={() => toggleGroup(group.id)}
            onFileClick={(file: any) => setSelectedItem({ ...file, group: group.title })}
            onDelete={handleDelete}
            deletingFile={deletingFile}
          />
        ))}
      </div>
    </div>
  );
}

function StepItem({ number, label, done, active }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${done ? "bg-green-500 text-white" : active ? "bg-blue-500 text-white" : "bg-white/10 text-white/40"}`}>
        {done ? "✓" : number}
      </div>
      <span className={`text-sm ${active ? "text-white" : done ? "text-green-400" : "text-white/40"}`}>
        {label}
      </span>
    </div>
  );
}

function StatCard({ label, value, sublabel, color = "blue" }: any) {
  const colorClasses: any = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="text-white/60 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]} mb-1`}>{value}</div>
      <div className="text-white/40 text-xs">{sublabel}</div>
    </motion.div>
  );
}

function FileGroup({ group, isExpanded, onToggle, onFileClick, onDelete, deletingFile }: any) {
  const Icon = group.icon;

  const colorClasses: any = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  };

  const colors = colorClasses[group.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-3xl border ${colors.border} overflow-hidden`}
    >
      <div onClick={onToggle} className="p-6 cursor-pointer hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${colors.bg}`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-lg">
                  {group.confidence}% confident
                </span>
              </div>
              <p className="text-white/60 text-sm">{group.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-2xl font-bold ${colors.text}`}>{group.size}</div>
              <div className="text-white/50 text-sm">{group.count} items</div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-6 h-6 text-white/40" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            {/* Safety warning for non-junk files */}
            {!group.canAutoClean && (
              <div className="mx-4 mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-yellow-400 text-xs">Review each file carefully before deleting</span>
              </div>
            )}

            <div className="p-4 space-y-2">
              {group.files.length === 0 ? (
                <div className="text-white/40 text-sm text-center py-4">No files found</div>
              ) : (
                group.files.map((file: any, index: number) => (
                  <FileItem
                    key={index}
                    file={file}
                    color={colors}
                    onClick={() => onFileClick(file)}
                    onDelete={() => onDelete(file.path)}
                    isDeleting={deletingFile === file.path}
                    canAutoClean={group.canAutoClean}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FileItem({ file, color, onClick, onDelete, isDeleting, canAutoClean }: any) {
  const reason = file.reason || (file.size_mb > 100
    ? `This file is ${file.size_mb} MB — above 100MB threshold`
    : file.unused_days
    ? `Not accessed in ${file.unused_days} days`
    : "Detected as junk file");

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
    >
      <div onClick={onClick} className="flex items-center gap-3 flex-1 cursor-pointer">
        <FileText className="w-5 h-5 text-white/40 shrink-0" />
        <div className="min-w-0">
          <div className="text-white font-medium text-sm truncate">{file.name}</div>
          <div className="text-white/40 text-xs truncate">{reason}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <div className="text-white/60 text-sm font-mono whitespace-nowrap">{file.size_mb} MB</div>
        {canAutoClean && (
          <div className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-lg">
            <CheckCircle2 className="w-3 h-3" />
            Safe
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={isDeleting}
          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className={`w-4 h-4 ${isDeleting ? "text-white/20 animate-pulse" : "text-white/20 group-hover:text-red-400"} transition-colors`} />
        </button>
      </div>
    </motion.div>
  );
}