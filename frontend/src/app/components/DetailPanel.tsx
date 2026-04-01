// ─── DetailPanel.tsx ──────────────────────────────────────────
// File ya insight card ka detail view.
//
// Handle: Left edge pe bahar nikla hua blue pill
//   - Click → animated slide out (right mein)
//   - Drag left → 60px se zyada → close
//   - Hover pe blue bright
//
// isClosing prop: Layout.tsx se aata hai —
//   panel ko right mein slide out karta hai (translateX 100%)
//   Main content saath mein expand hota hai — door effect
// ──────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  X, FileText, Clock, ShieldCheck, AlertTriangle,
  Trash2, FileX, Copy, FolderOpen, Calendar,
  ChevronDown, ChevronUp, ChevronsRight
} from "lucide-react";

// ─── Toast ────────────────────────────────────────────────────
function showToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.style.cssText = `
    position: fixed; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    background: #1e293b; color: white;
    padding: 8px 16px; border-radius: 12px;
    font-size: 13px; z-index: 9999;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ─── InsightDetails ───────────────────────────────────────────
function InsightDetails({ item }: any) {
  const Icon = item.icon;
  const colorMap: any = {
    blue:   { bg: "rgba(59,130,246,0.1)",  color: "#60a5fa", border: "rgba(59,130,246,0.2)"  },
    purple: { bg: "rgba(168,85,247,0.1)",  color: "#c084fc", border: "rgba(168,85,247,0.2)"  },
    yellow: { bg: "rgba(234,179,8,0.1)",   color: "#facc15", border: "rgba(234,179,8,0.2)"   },
    red:    { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.2)"   },
  };
  const c = colorMap[item.color] || colorMap.blue;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      <div style={{ textAlign: "center", paddingTop: "var(--space-sm)" }}>
        <div style={{
          display: "inline-flex", padding: "var(--space-lg)",
          borderRadius: "var(--radius-xl)", background: c.bg, marginBottom: "var(--space-sm)",
        }}>
          <Icon style={{ width: "var(--icon-xl)", height: "var(--icon-xl)", color: c.color }} />
        </div>
        <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "white", marginBottom: "2px" }}>{item.title}</div>
        <div style={{ fontSize: "var(--text-xxl)", fontWeight: 700, color: "white" }}>{item.value}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{item.count}</div>
      </div>

      <div className="isa-card" style={{ borderColor: c.border }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
          <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.5)" }}>Confidence Level</span>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: c.color }}>{item.confidence}%</span>
        </div>
        <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              height: "100%", borderRadius: "var(--radius-full)",
              background: item.confidence >= 80 ? "#22c55e" : item.confidence >= 50 ? "#eab308" : "#ef4444",
            }}
          />
        </div>
      </div>

      <div className="isa-card">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}>
          <ShieldCheck style={{ width: "var(--icon-sm)", height: "var(--icon-sm)", color: "#4ade80" }} />
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>Why This Matters</span>
        </div>
        <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>{item.insight}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        {[
          { label: "Category",     value: item.title,      color: "white"   },
          { label: "Impact",       value: "Medium",        color: "white"   },
          { label: "Safety Level", value: "Safe to clean", color: "#4ade80" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "var(--space-xs) var(--space-sm)",
            borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.04)",
          }}>
            <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.5)" }}>{label}</span>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FileDetails ──────────────────────────────────────────────
function FileDetails({ item }: any) {
  const [pathExpanded, setPathExpanded] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);

  const ext = item.name?.split(".").pop()?.toUpperCase() || "?";
  const fileTypeMap: any = {
    ZIP: "Compressed Archive", EXE: "Executable",  MP4: "Video File",
    MP3: "Audio File",         PDF: "PDF Document", DAT: "Data File",
    VHDX: "Virtual Disk",      BAT: "Batch Script", MSI: "Installer",
    LOG: "Log File",           TMP: "Temp File",    JS: "JavaScript",
    TS: "TypeScript",          JSON: "JSON Data",   MD: "Markdown",
    CONFIGURE: "Config File",  TSF: "Font File",
  };
  const fileType     = fileTypeMap[ext] || `${ext} File`;
  const sizeMb       = item.size_mb || 0;
  const sizeDisplay  = sizeMb > 1024 ? `${(sizeMb / 1024).toFixed(1)} GB` : `${sizeMb} MB`;
  const lastAccessed = item.last_accessed
    ? new Date(item.last_accessed).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Never";
  const lastModified = item.last_modified
    ? new Date(item.last_modified).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Unknown";
  const isSafe = item.reason?.includes("cache") || item.reason?.includes("junk") || item.reason?.includes("temp");
  const daysSinceAccess = item.last_accessed
    ? Math.floor((Date.now() - new Date(item.last_accessed).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const intelligenceScore = item.intelligence_score;
  const scoreReasons: string[] = item.score_reasons || [];

  const getAiAnalysis = () => {
    const timeInfo = [
      lastModified !== "Unknown" ? `Last modified: ${lastModified}.` : null,
      daysSinceAccess !== null ? `Last accessed ${daysSinceAccess} days ago.` : null,
    ].filter(Boolean).join(" ");
    if (item.unused_days) return `${timeInfo} Not accessed in ${item.unused_days} days — may no longer be needed.`;
    if (sizeMb > 1000) return `${timeInfo} Large file taking ${sizeDisplay}. Delete if no longer needed.`;
    if (isSafe) return `${timeInfo} Auto-generated ${fileType.toLowerCase()}. Safe to delete.`;
    if (["EXE", "BAT", "MSI", "CMD", "PS1"].includes(ext)) return `${timeInfo} Executable — verify before deleting.`;
    return `${timeInfo} Flagged for review. Check before deleting.`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-md)",
        padding: "var(--space-sm)",
        background: "rgba(59,130,246,0.06)", borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(59,130,246,0.12)",
      }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "var(--radius-md)",
          background: "rgba(59,130,246,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <FileText style={{ width: "var(--icon-md)", height: "var(--icon-md)", color: "#60a5fa" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.name}
          </div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "#60a5fa", lineHeight: 1.2 }}>{sizeDisplay}</div>
        </div>
      </div>

      <div className="isa-card" style={{ padding: "var(--space-sm)" }}>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "var(--space-sm)" }}>
          File Info
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>Type</div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>{fileType}</div>
          </div>
          {item.unused_days && (
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>Unused</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "#facc15" }}>{item.unused_days}d</div>
            </div>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>
              <Clock style={{ width: "10px", height: "10px", display: "inline", marginRight: "2px" }} />Accessed
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>{lastAccessed}</div>
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>
              <Calendar style={{ width: "10px", height: "10px", display: "inline", marginRight: "2px" }} />Modified
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>{lastModified}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>Location</div>
          <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
            <div
              onClick={() => setPathExpanded(!pathExpanded)}
              style={{
                fontSize: "10px", fontFamily: "monospace", color: "rgba(255,255,255,0.5)",
                flex: 1, lineHeight: 1.4, cursor: "pointer",
                overflow: pathExpanded ? "visible" : "hidden",
                textOverflow: pathExpanded ? "unset" : "ellipsis",
                whiteSpace: pathExpanded ? "pre-wrap" : "nowrap",
                wordBreak: pathExpanded ? "break-all" : "normal",
              }}
            >
              {item.path || "Unknown"}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(item.path || ""); showToast("📋 Copied!"); }}
              style={{ flexShrink: 0, padding: "2px", background: "transparent", border: "none", cursor: "pointer" }}>
              <Copy style={{ width: "10px", height: "10px", color: "rgba(255,255,255,0.35)" }} />
            </button>
            <button onClick={() => setPathExpanded(!pathExpanded)}
              style={{ flexShrink: 0, padding: "2px", background: "transparent", border: "none", cursor: "pointer" }}>
              {pathExpanded
                ? <ChevronUp style={{ width: "10px", height: "10px", color: "rgba(255,255,255,0.35)" }} />
                : <ChevronDown style={{ width: "10px", height: "10px", color: "rgba(255,255,255,0.35)" }} />}
            </button>
          </div>
        </div>
      </div>

      {intelligenceScore !== undefined && (
        <div className="isa-card" style={{ padding: "var(--space-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>ISA Score</span>
            <span style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: intelligenceScore >= 70 ? "#4ade80" : intelligenceScore >= 40 ? "#facc15" : "#f87171" }}>
              {intelligenceScore}/100
            </span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--space-xs)" }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${intelligenceScore}%` }} transition={{ duration: 1 }}
              style={{ height: "100%", borderRadius: "var(--radius-full)", background: intelligenceScore >= 70 ? "#22c55e" : intelligenceScore >= 40 ? "#eab308" : "#ef4444" }}
            />
          </div>
          {scoreReasons.slice(0, 2).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
              <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)" }}>{r}</span>
            </div>
          ))}
        </div>
      )}

      <div className="isa-card" style={{ padding: "var(--space-sm)", borderColor: "rgba(59,130,246,0.2)" }}>
        <button onClick={() => setAnalysisExpanded(!analysisExpanded)}
          style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#60a5fa" }} />
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "white" }}>AI Analysis</span>
          </div>
          {analysisExpanded
            ? <ChevronUp style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.4)" }} />
            : <ChevronDown style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.4)" }} />}
        </button>
        {analysisExpanded && (
          <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0, marginTop: "var(--space-sm)" }}>
            {getAiAnalysis()}
          </p>
        )}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-sm)",
        padding: "var(--space-xs) var(--space-sm)", borderRadius: "var(--radius-md)",
        background: isSafe ? "rgba(34,197,94,0.08)" : "rgba(234,179,8,0.08)",
        border: `1px solid ${isSafe ? "rgba(34,197,94,0.2)" : "rgba(234,179,8,0.2)"}`,
      }}>
        {isSafe
          ? <ShieldCheck style={{ width: "var(--icon-sm)", height: "var(--icon-sm)", color: "#4ade80", flexShrink: 0 }} />
          : <AlertTriangle style={{ width: "var(--icon-sm)", height: "var(--icon-sm)", color: "#facc15", flexShrink: 0 }} />}
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: isSafe ? "#4ade80" : "#facc15" }}>
          {isSafe ? "Safe to Delete" : "Review Recommended"}
        </span>
        <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)" }}>
          {isSafe ? "— auto-generated" : "— verify first"}
        </span>
      </div>
    </div>
  );
}

// ─── Main DetailPanel ─────────────────────────────────────────
export function DetailPanel({ item, onClose, onDelete, isClosing }: {
  item: any;
  onClose: () => void;
  onDelete: (paths: string[]) => void;
  isClosing?: boolean;
}) {
  const isInsightCard = item.icon;

  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const CLOSE_THRESHOLD = 60;

  const handleDragStart = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();

    const onMove = (ev: MouseEvent) => {
      if (dragStartX.current === null) return;
      setDragOffset(Math.max(0, dragStartX.current - ev.clientX));
    };
    const onUp = (ev: MouseEvent) => {
      if (dragStartX.current === null) return;
      if (dragStartX.current - ev.clientX >= CLOSE_THRESHOLD) onClose();
      dragStartX.current = null;
      setDragOffset(0);
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const thresholdCrossed = dragOffset >= CLOSE_THRESHOLD;

  // ── Panel ka transform ────────────────────────────────────
  // isClosing → right mein slide out (100%)
  // isDragging → drag feedback (thoda right shift)
  // normal → translateX(0)
  const panelTransform = isClosing
    ? "translateX(100%)"
    : isDragging
      ? `translateX(${Math.min(dragOffset * 0.3, 16)}px)`
      : "translateX(0px)";

  const panelTransition = isClosing
    ? "transform 450ms cubic-bezier(0.4,0,0.2,1)"
    : isDragging
      ? "none"
      : "transform 200ms cubic-bezier(0.4,0,0.2,1)";

  return (
    <div
      className="isa-panel-container"
      style={{ position: "relative", overflow: "visible", width: "100%", height: "100%" }}
    >
      {/* ── Handle Pill ───────────────────────────────────────── */}
      <div
        onMouseDown={handleDragStart}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "absolute",
          left: "-16px",
          top: "50%",
          transform: isHovered && !isDragging
            ? "translateY(-50%) scaleX(1.2)"
            : "translateY(-50%)",
          zIndex: 20,
          width: "12px",
          height: "56px",
          borderRadius: "6px",
          background: thresholdCrossed
            ? "rgba(239,68,68,0.4)"
            : isHovered
              ? "rgba(96,165,250,0.8)"
              : "rgba(96,165,250,0.35)",
          border: "none",
          boxShadow: thresholdCrossed
            ? "0 0 12px rgba(239,68,68,0.4)"
            : isHovered
              ? "0 0 12px rgba(96,165,250,0.5)"
              : "0 0 6px rgba(96,165,250,0.15)",
          cursor: isDragging ? "grabbing" : "pointer",
          transition: isDragging ? "none" : "all 150ms ease",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Click or drag to close"
      >
        <ChevronsRight
          style={{
            width: "10px", height: "10px",
            color: thresholdCrossed ? "#f87171" : isHovered ? "white" : "rgba(255,255,255,0.6)",
            transition: "color 150ms ease",
            flexShrink: 0,
          }}
        />
      </div>

      {/* ── Main Panel aside ──────────────────────────────────── */}
      <aside
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(15,23,42,0.97)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          // isClosing → slide out right
          // isDragging → drag feedback
          // normal → no transform
          transform: panelTransform,
          transition: panelTransition,
        }}
      >
        {/* Header */}
        <div style={{
          padding: "var(--space-md) var(--space-lg)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "white" }}>Details</span>
          <button
            onClick={onClose}
            style={{ padding: "var(--space-xs)", borderRadius: "var(--radius-md)", background: "transparent", border: "none", cursor: "pointer", display: "flex" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X style={{ width: "var(--icon-sm)", height: "var(--icon-sm)", color: "rgba(255,255,255,0.5)" }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "var(--space-md)",
          display: "flex", flexDirection: "column", gap: "var(--space-sm)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}>
          {isInsightCard ? <InsightDetails item={item} /> : <FileDetails item={item} />}
        </div>

        {/* Action Buttons */}
        {!isInsightCard && (
          <div style={{
            padding: "var(--space-sm) var(--space-md)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--space-xs)", flexShrink: 0,
          }}>
            <button
              onClick={() => { navigator.clipboard.writeText(item.path || ""); showToast("📋 Path copied!"); }}
              style={{ padding: "var(--space-sm) var(--space-xs)", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "all var(--transition-fast)", fontSize: "var(--text-xs)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <FolderOpen style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
              Location
            </button>
            <button
              onClick={() => onDelete?.([item.path])}
              style={{ padding: "var(--space-sm) var(--space-xs)", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "all var(--transition-fast)", fontSize: "var(--text-xs)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            >
              <Trash2 style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
              Delete
            </button>
            <button
              style={{ padding: "var(--space-sm) var(--space-xs)", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", transition: "all var(--transition-fast)", fontSize: "var(--text-xs)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <FileX style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
              Ignore
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}