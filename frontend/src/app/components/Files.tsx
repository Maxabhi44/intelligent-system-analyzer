import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, FileText, Package, Calendar, Trash2,
  CheckCircle2, AlertTriangle, Square, CheckSquare,
  ExternalLink, X, Undo2,
} from "lucide-react";
import { useOutletContext, useSearchParams } from "react-router";
import { getSummary, trashFile, undoTrash } from "../../api";

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, onUndo, onClose }: { message: string; onUndo: () => void; onClose: () => void }) {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(interval); onClose(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-2xl"
      style={{ padding: "var(--space-md) var(--space-lg)" }}
    >
      <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.8)" }}>{message}</span>
      <button
        onClick={onUndo}
        className="flex items-center gap-1.5 text-blue-400 font-medium hover:text-blue-300 transition-colors"
        style={{ fontSize: "var(--text-sm)" }}
      >
        <Undo2 style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
        Undo ({seconds}s)
      </button>
      <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
        <X style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Files() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showMoreGroups, setShowMoreGroups] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; trashIds: string[] } | null>(null);
  const { setSelectedItem, setOnDeleteFile } = useOutletContext<any>();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const sectionRefs: any = {
    junk: useRef(null),
    large: useRef(null),
    unused: useRef(null),
    risky: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSummary("C:/Users/maxab/Downloads");
        setScanData(data);
        if (categoryFilter) {
          setExpandedGroups([categoryFilter]);
          setTimeout(() => {
            sectionRefs[categoryFilter]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
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

  const handleDelete = async (filePaths: string[]) => {
    const newDeleting = new Set(deletingFiles);
    filePaths.forEach(p => newDeleting.add(p));
    setDeletingFiles(newDeleting);

    const trashIds: string[] = [];
    try {
      for (const path of filePaths) {
        const result = await trashFile(path);
        if (result.success) trashIds.push(result.trash_id);
      }
      const data = await getSummary("C:/Users/maxab/Downloads");
      setScanData(data);
      setSelectedFiles(new Set());
      setToast({
        message: `${filePaths.length} file${filePaths.length > 1 ? "s" : ""} moved to trash`,
        trashIds,
      });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      const done = new Set(deletingFiles);
      filePaths.forEach(p => done.delete(p));
      setDeletingFiles(done);
    }
  };

  const handleUndo = async () => {
    if (!toast) return;
    const currentToast = toast;
    setToast(null);
    try {
      for (const trashId of currentToast.trashIds) {
        await undoTrash(trashId);
      }
      const data = await getSummary("C:/Users/maxab/Downloads");
      setScanData(data);
    } catch (err) {
      console.error("Undo failed:", err);
      setToast(currentToast);
      alert("Undo failed — backend chal raha hai?");
    }
  };

  useEffect(() => {
    setOnDeleteFile(() => handleDelete);
  }, []);

  const jumpToSection = (id: string) => {
    if (!expandedGroups.includes(id)) {
      setExpandedGroups(prev => [...prev, id]);
    }
    setTimeout(() => {
      sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ padding: "var(--space-xxl)" }}>
        <div style={{ fontSize: "var(--text-md)", color: "rgba(255,255,255,0.5)" }}>Scanning files...</div>
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
      allFiles: scanData.junk_files.files,
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
      allFiles: scanData.large_files.files,
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
      allFiles: scanData.unused_files.files,
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
      allFiles: scanData.risky_files.files,
      canAutoClean: false,
    },
  ] : [];

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

  const toggleFileSelect = (path: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const toggleSelectAll = (files: any[]) => {
    const allPaths = files.map((f: any) => f.path);
    const allSelected = allPaths.every(p => selectedFiles.has(p));
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allPaths.forEach(p => next.delete(p));
      } else {
        allPaths.forEach(p => next.add(p));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-32" style={{ padding: "var(--space-xxl)" }}>

      {/* Header */}
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <h2
          className="font-semibold text-white"
          style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-xs)" }}
        >
          Smart File View
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.5)" }}>
          {categoryFilter
            ? `Showing: ${fileGroups.find(g => g.id === categoryFilter)?.title}`
            : "Files organized by intelligent insights"}
        </p>
      </div>

      {/* Nav Tabs — Section Jump */}
      <div
        className="flex items-center glass-card rounded-2xl sticky top-4 z-40"
        style={{ gap: "var(--space-xs)", marginBottom: "var(--space-xl)", padding: "var(--space-xs)" }}
      >
        {fileGroups.map((group) => {
          const Icon = group.icon;
          const colorMap: any = {
            blue:   "text-blue-400 bg-blue-500/10 border-blue-500/30",
            purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
            yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
            red:    "text-red-400 bg-red-500/10 border-red-500/30",
          };
          const isActive = expandedGroups.includes(group.id);
          return (
            <button
              key={group.id}
              onClick={() => jumpToSection(group.id)}
              className={`flex items-center rounded-xl border font-medium transition-all flex-1 justify-center
                ${isActive ? colorMap[group.color] : "text-white/40 border-transparent hover:text-white/60"}`}
              style={{
                gap: "var(--space-xs)",
                padding: "var(--tab-py) var(--tab-px)",
                fontSize: "var(--tab-text)",
              }}
            >
              <Icon style={{ width: "var(--tab-icon)", height: "var(--tab-icon)" }} />
              {group.title}
              <span style={{ fontSize: "var(--text-xs)", opacity: 0.6 }}>({group.count})</span>
            </button>
          );
        })}
      </div>

      {/* Step Indicator */}
      <div
        className="flex items-center glass-card rounded-2xl"
        style={{ gap: "var(--space-md)", marginBottom: "var(--space-xl)", padding: "var(--card-padding)" }}
      >
        <StepItem number={1} label="Scan" done={true} />
        <div className="flex-1 h-px bg-white/10" />
        <StepItem number={2} label="Review" active={true} />
        <div className="flex-1 h-px bg-white/10" />
        <StepItem number={3} label="Clean" />
      </div>

      {/* File Groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {orderedGroups.map((group) => {
          const showAll = showMoreGroups.has(group.id);
          const visibleFiles = showAll ? group.allFiles : group.allFiles.slice(0, 10);
          const groupSelectedCount = group.allFiles.filter((f: any) => selectedFiles.has(f.path)).length;

          return (
            <div key={group.id} ref={sectionRefs[group.id]}>
              <FileGroup
                group={{ ...group, files: visibleFiles }}
                isExpanded={expandedGroups.includes(group.id)}
                onToggle={() => toggleGroup(group.id)}
                onFileClick={(file: any) => setSelectedItem({ ...file, group: group.title })}
                onDelete={(paths: string[]) => handleDelete(paths)}
                deletingFiles={deletingFiles}
                selectedFiles={selectedFiles}
                onSelectFile={toggleFileSelect}
                onSelectAll={() => toggleSelectAll(group.allFiles)}
                groupSelectedCount={groupSelectedCount}
                totalCount={group.allFiles.length}
                showMore={showAll}
                onShowMore={() => setShowMoreGroups(prev => {
                  const next = new Set(prev);
                  next.has(group.id) ? next.delete(group.id) : next.add(group.id);
                  return next;
                })}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <AnimatePresence>
        {selectedFiles.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-2xl"
            style={{ gap: "var(--space-md)", padding: "var(--space-md) var(--space-lg)" }}
          >
            <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)" }}>
              <span className="text-white font-semibold">{selectedFiles.size}</span> files selected
            </span>
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={() => handleDelete(Array.from(selectedFiles))}
              className="flex items-center gap-2 text-red-400 font-medium hover:text-red-300 transition-colors"
              style={{ fontSize: "var(--text-sm)" }}
            >
              <Trash2 style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
              Delete Selected
            </button>
            <button onClick={() => setSelectedFiles(new Set())} className="text-white/30 hover:text-white/60 transition-colors">
              <X style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            onUndo={handleUndo}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepItem({ number, label, done, active }: any) {
  return (
    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
      <div
        className={`rounded-full flex items-center justify-center font-bold
          ${done ? "bg-green-500 text-white" : active ? "bg-blue-500 text-white" : "bg-white/10 text-white/40"}`}
        style={{
          width: "var(--icon-lg)",
          height: "var(--icon-lg)",
          fontSize: "var(--text-xs)",
        }}
      >
        {done ? "✓" : number}
      </div>
      <span
        style={{ fontSize: "var(--text-sm)" }}
        className={active ? "text-white" : done ? "text-green-400" : "text-white/40"}
      >
        {label}
      </span>
    </div>
  );
}

// ─── File Group ───────────────────────────────────────────────────────────────
function FileGroup({
  group, isExpanded, onToggle, onFileClick, onDelete,
  deletingFiles, selectedFiles, onSelectFile, onSelectAll,
  groupSelectedCount, totalCount, showMore, onShowMore
}: any) {
  const Icon = group.icon;

  const colorClasses: any = {
    blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
    red:    { bg: "bg-red-500/10",    border: "border-red-500/20",    text: "text-red-400" },
  };

  const colors = colorClasses[group.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-3xl border ${colors.border} overflow-hidden`}
    >
      {/* Group Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer hover:bg-white/5 transition-colors"
        style={{ padding: "var(--card-padding)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: "var(--space-md)" }}>
            <div className={`p-3 rounded-2xl ${colors.bg}`}>
              <Icon
                className={colors.text}
                style={{ width: "var(--icon-lg)", height: "var(--icon-lg)" }}
              />
            </div>
            <div>
              <div className="flex items-center" style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}>
                <h3
                  className="font-semibold text-white"
                  style={{ fontSize: "var(--text-lg)" }}
                >
                  {group.title}
                </h3>
                <span
                  className="text-white/50 bg-white/5 rounded-lg"
                  style={{ fontSize: "var(--text-xs)", padding: "2px var(--space-xs)" }}
                >
                  {group.confidence}% confident
                </span>
                {groupSelectedCount > 0 && (
                  <span
                    className="text-blue-400 bg-blue-500/10 rounded-lg"
                    style={{ fontSize: "var(--text-xs)", padding: "2px var(--space-xs)" }}
                  >
                    {groupSelectedCount} selected
                  </span>
                )}
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)" }}>
                {group.description}
              </p>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: "var(--space-lg)" }}>
            <div className="text-right">
              <div className={`font-bold ${colors.text}`} style={{ fontSize: "var(--text-xl)" }}>
                {group.size}
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.5)" }}>
                {group.count} items
              </div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown
                className="text-white/40"
                style={{ width: "var(--icon-md)", height: "var(--icon-md)" }}
              />
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
            {/* Warning */}
            {!group.canAutoClean && (
              <div
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center"
                style={{ margin: "var(--space-md) var(--space-md) 0", padding: "var(--space-sm)", gap: "var(--space-xs)" }}
              >
                <AlertTriangle
                  className="text-yellow-400 shrink-0"
                  style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }}
                />
                <span style={{ fontSize: "var(--text-xs)" }} className="text-yellow-400">
                  Review each file carefully before deleting
                </span>
              </div>
            )}

            {/* Select All row */}
            <div
              className="flex items-center justify-between"
              style={{ padding: "var(--space-md) var(--space-md) 0" }}
            >
              <button
                onClick={onSelectAll}
                className="flex items-center text-white/40 hover:text-white/70 transition-colors"
                style={{ gap: "var(--space-xs)", fontSize: "var(--text-xs)" }}
              >
                {groupSelectedCount === totalCount && totalCount > 0
                  ? <CheckSquare style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} className="text-blue-400" />
                  : <Square style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
                }
                Select All ({totalCount})
              </button>
              {groupSelectedCount > 0 && (
                <button
                  onClick={() => {
                    const paths = group.files
                      .filter((f: any) => selectedFiles.has(f.path))
                      .map((f: any) => f.path);
                    onDelete(paths);
                  }}
                  style={{ fontSize: "var(--text-xs)" }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete selected
                </button>
              )}
            </div>

            {/* File List */}
            <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {group.files.length === 0 ? (
                <div
                  className="text-white/40 text-center"
                  style={{ fontSize: "var(--text-sm)", padding: "var(--space-md) 0" }}
                >
                  No files found
                </div>
              ) : (
                group.files.map((file: any, index: number) => (
                  <FileItem
                    key={index}
                    file={file}
                    color={colors}
                    onClick={() => onFileClick(file)}
                    onDelete={() => onDelete([file.path])}
                    isDeleting={deletingFiles.has(file.path)}
                    canAutoClean={group.canAutoClean}
                    isSelected={selectedFiles.has(file.path)}
                    onSelect={() => onSelectFile(file.path)}
                  />
                ))
              )}
            </div>

            {/* See More / See Less */}
            {totalCount > 10 && (
              <div style={{ padding: "0 var(--space-md) var(--space-md)" }}>
                <button
                  onClick={onShowMore}
                  className={`w-full rounded-xl font-medium transition-all ${colors.bg} ${colors.text} hover:brightness-125`}
                  style={{ padding: "var(--space-sm) 0", fontSize: "var(--text-sm)" }}
                >
                  {showMore ? "See Less ↑" : `See More (${totalCount - 10} more) ↓`}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── File Item ────────────────────────────────────────────────────────────────
function FileItem({ file, color, onClick, onDelete, isDeleting, canAutoClean, isSelected, onSelect }: any) {
  const reason = file.reason || (file.size_mb > 100
    ? `This file is ${file.size_mb} MB — above 100MB threshold`
    : file.unused_days
    ? `Not accessed in ${file.unused_days} days`
    : "Detected as junk file");

  const openFile = (e: any) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.path);
    const el = document.createElement("div");
    el.innerText = "📋 Path copied!";
    el.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e1e2e;color:white;padding:8px 16px;border-radius:12px;font-size:13px;z-index:9999;border:1px solid rgba(255,255,255,0.1)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className={`flex items-center justify-between rounded-xl transition-all duration-200 group
        ${isSelected ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 hover:bg-white/10"}`}
      style={{ padding: "var(--file-item-py) var(--file-item-px)" }}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{ marginRight: "var(--space-sm)", flexShrink: 0 }}
      >
        {isSelected
          ? <CheckSquare style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} className="text-blue-400" />
          : <Square style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} className="text-white/20 group-hover:text-white/40" />
        }
      </button>

      {/* File Info */}
      <div
        onClick={onClick}
        className="flex items-center flex-1 cursor-pointer min-w-0"
        style={{ gap: "var(--space-sm)" }}
      >
        <FileText
          className="text-white/40 shrink-0"
          style={{ width: "var(--icon-md)", height: "var(--icon-md)" }}
        />
        <div className="min-w-0">
          <div
            className="text-white font-medium truncate"
            style={{ fontSize: "var(--file-name-size)" }}
          >
            {file.name}
          </div>
          <div
            className="text-white/40 truncate"
            style={{ fontSize: "var(--file-meta-size)" }}
          >
            {reason}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center shrink-0" style={{ gap: "var(--space-xs)", marginLeft: "var(--space-md)" }}>
        <div
          className="text-white/50 font-mono"
          style={{ fontSize: "var(--file-meta-size)" }}
        >
          {file.size_mb} MB
        </div>
        {canAutoClean && (
          <div
            className="flex items-center gap-1 text-green-400 bg-green-500/10 rounded-lg"
            style={{ fontSize: "var(--text-xs)", padding: "2px var(--space-xs)" }}
          >
            <CheckCircle2 style={{ width: "var(--icon-xs)", height: "var(--icon-xs)" }} />
            Safe
          </div>
        )}
        <button
          onClick={openFile}
          className="rounded-lg hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
          style={{ padding: "var(--space-xs)" }}
          title="Copy file path"
        >
          <ExternalLink
            className="text-white/40 hover:text-white/70"
            style={{ width: "var(--icon-xs)", height: "var(--icon-xs)" }}
          />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={isDeleting}
          className="rounded-lg hover:bg-red-500/20 transition-colors"
          style={{ padding: "var(--space-xs)" }}
        >
          <Trash2
            style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }}
            className={`${isDeleting ? "text-white/20 animate-pulse" : "text-white/20 group-hover:text-red-400"} transition-colors`}
          />
        </button>
      </div>
    </motion.div>
  );
}