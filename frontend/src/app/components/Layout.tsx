// ─── Layout.tsx ───────────────────────────────────────────────
// App ka main shell — sidebar + main content + detail panel.
//
// Detail Panel ke 2 modes:
//   DOCKED  (window >= 768px) → panel side mein, Box 2 smoothly shrinks
//   OVERLAY (window <  768px) → panel Box 2 ke upar float karta hai,
//                               Box 2 blur ho jaata hai (beautiful effect)
//
// Panel open/close animation:
//   DOCKED  → Box 3 right se slide in, Box 2 flex se adjust (door effect)
//   OVERLAY → Box 3 right se slide in, Box 2 blur + darken behind
//
// Panel close animation:
//   - isClosing state → panel right mein slide out (300ms)
//   - DOCKED: Box 2 saath mein expand hota hai (door effect)
//   - OVERLAY: blur fade out hota hai
// ──────────────────────────────────────────────────────────────

import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard, Scan as ScanIcon, FolderOpen,
  Code2, Settings as SettingsIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DetailPanel } from "./DetailPanel";
import { PageTransition } from "./PageTransition";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const SIDEBAR_COLLAPSE_BP = 1100; // Sidebar icon-only mode
const PANEL_OVERLAY_BP    = 768;  // < 768px → blur overlay mode
                                  // >= 768px → docked side-by-side mode

export function Layout() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [onDeleteFile, setOnDeleteFile] = useState<((paths: string[]) => void) | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const windowWidth = useWindowWidth();
  const sidebarCollapsed = windowWidth < SIDEBAR_COLLAPSE_BP;
  const panelIsOverlay   = windowWidth < PANEL_OVERLAY_BP;
  // panelIsOverlay = true  → phone/tablet: blur mode
  // panelIsOverlay = false → desktop: docked slide mode

  const location = useLocation();

  // Route change pe panel auto-close (no animation needed)
  useEffect(() => {
    setSelectedItem(null);
    setIsClosing(false);
  }, [location.pathname]);

  // ── Animated close ─────────────────────────────────────────
  // 1. isClosing = true  → DetailPanel slide out right (300ms)
  // 2. 300ms baad → selectedItem null, panel unmount
  // DOCKED: Box 2 saath expand hota hai (flex transition)
  // OVERLAY: backdrop blur fade out hota hai
  // 1. handleClose
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 450);
  };

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "#0F172A",
      overflow: "hidden",
      display: "flex",
      isolation: "isolate",
    }}>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside style={{
        width: sidebarCollapsed ? "var(--sidebar-icon-only)" : "var(--sidebar-width)",
        minWidth: sidebarCollapsed ? "var(--sidebar-icon-only)" : "var(--sidebar-width)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width var(--transition-sidebar), min-width var(--transition-sidebar)",
        willChange: "width",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? "var(--space-md) var(--space-sm)" : "var(--space-lg) var(--space-lg)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", gap: "var(--space-sm)",
          overflow: "hidden",
          transition: "padding var(--transition-sidebar)",
        }}>
          <div style={{
            width: "var(--icon-lg)", height: "var(--icon-lg)",
            borderRadius: "var(--radius-sm)",
            background: "rgba(59,130,246,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: "var(--text-sm)", color: "#60a5fa", fontWeight: 700 }}>I</span>
          </div>
          <div style={{
            overflow: "hidden",
            opacity: sidebarCollapsed ? 0 : 1,
            transform: sidebarCollapsed ? "translateX(-8px)" : "translateX(0px)",
            transition: "opacity var(--transition-sidebar), transform var(--transition-sidebar)",
            pointerEvents: sidebarCollapsed ? "none" : "auto",
            whiteSpace: "nowrap",
          }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "white" }}>ISA</div>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis" }}>
              Intelligent System Analyzer
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{
          flex: 1, padding: "var(--space-md) var(--space-sm)",
          display: "flex", flexDirection: "column", gap: "var(--space-xs)",
          overflow: "hidden",
        }}>
          <NavItem to="/"          icon={LayoutDashboard} label="Dashboard"      collapsed={sidebarCollapsed} />
          <NavItem to="/scan"      icon={ScanIcon}        label="Scan"           collapsed={sidebarCollapsed} />
          <NavItem to="/files"     icon={FolderOpen}      label="Files"          collapsed={sidebarCollapsed} />
          <NavItem to="/developer" icon={Code2}           label="Developer Mode" collapsed={sidebarCollapsed} />
          <NavItem to="/settings"  icon={SettingsIcon}    label="Settings"       collapsed={sidebarCollapsed} />
        </nav>

        {/* Footer */}
        <div style={{
          padding: "var(--space-md) var(--space-lg)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
          opacity: sidebarCollapsed ? 0 : 1,
          transform: sidebarCollapsed ? "translateX(-8px)" : "translateX(0px)",
          transition: "opacity var(--transition-sidebar), transform var(--transition-sidebar)",
          pointerEvents: sidebarCollapsed ? "none" : "auto",
        }}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.25)" }}>Version 2.0.1</div>
        </div>
      </aside>

      {/* ── Content + Panel Wrapper ───────────────────────────── */}
      <div style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        display: "flex",
        overflow: "clip",
      }}>

        {/* ── Main Content (Box 2) ──────────────────────────────
            DOCKED mode:
              - Panel open → flex shrink hota hai (door effect)
              - Panel close → flex expand hota hai
              - transition: flex + filter smooth karta hai
            OVERLAY mode:
              - blur + darken jab panel open ho
              - pointerEvents none → click-through nahi hoga
              - blur close hote waqt smoothly fade out
        ──────────────────────────────────────────────────────── */}
        <main style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          transition: [
            "flex 450ms cubic-bezier(0.4,0,0.2,1)",
            "filter 450ms cubic-bezier(0.4,0,0.2,1)",
          ].join(", "),
          // OVERLAY mode: panel open hone pe blur + darken
          // isClosing pe bhi blur hata do (fade out)
          filter: panelIsOverlay && selectedItem && !isClosing
            ? "blur(3px) brightness(0.6)"
            : "none",
          // Blur mode mein Box 2 pe click block karo
          pointerEvents: panelIsOverlay && selectedItem ? "none" : "auto",
        }}>
          <PageTransition>
            <Outlet context={{ setSelectedItem, setOnDeleteFile }} />
          </PageTransition>
        </main>

        {/* ── Docked Detail Panel (Box 3) ───────────────────────
            >= 768px window mein side-by-side dikhta hai.
            isClosing ke waqt bhi DOM mein rakho —
            taaki slide out animation complete ho sake,
            phir selectedItem null hone pe unmount hoga.
        ──────────────────────────────────────────────────────── */}
        {(selectedItem || isClosing) && !panelIsOverlay && (
  <div style={{
    width: isClosing ? "0px" : "var(--panel-width)",      // ← YE ADD KARO
    minWidth: isClosing ? "0px" : "var(--panel-width)",   // ← YE ADD KARO
    flexShrink: 0,
    borderLeft: "1px solid rgba(255,255,255,0.05)",
    overflow: "visible",
    position: "relative",
    transition: "width 450ms cubic-bezier(0.4,0,0.2,1), min-width 450ms cubic-bezier(0.4,0,0.2,1)", // ← YE ADD KARO
    animation: !isClosing
      ? "panelSlideIn 450ms cubic-bezier(0.4,0,0.2,1) forwards"
      : "none",
  }}>
            {selectedItem && (
              <DetailPanel
                item={selectedItem}
                onClose={handleClose}
                onDelete={(paths) => onDeleteFile?.(paths)}
                isClosing={isClosing}
              />
            )}
          </div>
        )}

        {/* ── Overlay Backdrop ──────────────────────────────────
            < 768px window mein dikhta hai.
            Box 2 ke upar ek dark + blur layer —
            click karne pe panel close ho jaata hai.
            opacity transition → smooth fade in/out.
        ──────────────────────────────────────────────────────── */}
        {panelIsOverlay && (
          <div
            onClick={handleClose}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(2px)",
              zIndex: "var(--z-panel)",
              opacity: selectedItem && !isClosing ? 1 : 0,
              pointerEvents: selectedItem ? "auto" : "none",
              transition: "opacity 450ms cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )}

        {/* ── Overlay Detail Panel (Box 3) ──────────────────────
            < 768px window mein dikhta hai.
            Box 2 ke upar right side se slide in karta hai.
            isClosing → translateX(105%) se slide out.
            selectedItem null → panel right mein chala jaata hai.
        ──────────────────────────────────────────────────────── */}
        {panelIsOverlay && (
          <div style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0,
            width: "min(var(--panel-width), 85%)",
            zIndex: "var(--z-panel)",
            // isClosing ya no item → slide out right
            // selectedItem open → slide in (translateX 0)
            transform: selectedItem && !isClosing
              ? "translateX(0%)"
              : "translateX(105%)",
            transition: "transform 450ms cubic-bezier(0.4,0,0.2,1)",
            boxShadow: selectedItem ? "-8px 0 32px rgba(0,0,0,0.4)" : "none",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            willChange: "transform",
            overflow: "visible",
          }}>
            {selectedItem && (
              <DetailPanel
                item={selectedItem}
                onClose={handleClose}
                onDelete={(paths) => onDeleteFile?.(paths)}
                isClosing={isClosing}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NavItem ──────────────────────────────────────────────────
// Sidebar ka ek navigation link.
// collapsed = true → sirf icon dikhta hai (tooltip bhi)
// collapsed = false → icon + label dono
// ─────────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, collapsed }: {
  to: string; icon: any; label: string; collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      title={collapsed ? label : undefined}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: "var(--space-md)",
        padding: collapsed ? "var(--space-md) var(--space-sm)" : "var(--space-md) var(--space-md)",
        borderRadius: "var(--radius-lg)",
        textDecoration: "none",
        transition: [
          "background var(--transition-fast)",
          "color var(--transition-fast)",
          "box-shadow var(--transition-fast)",
          "transform var(--transition-fast)",
          "padding var(--transition-sidebar)",
        ].join(", "),
        background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
        color: isActive ? "#60a5fa" : "rgba(255,255,255,0.55)",
        boxShadow: isActive ? "0 0 0 1px rgba(59,130,246,0.2)" : "none",
        overflow: "hidden",
        whiteSpace: "nowrap",
        transform: isActive ? "scale(1.01)" : "scale(1)",
      })}
      className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}
    >
      {({ isActive }) => (
        <>
          <Icon style={{
            width: "var(--icon-md)", height: "var(--icon-md)", flexShrink: 0,
            color: isActive ? "#60a5fa" : "rgba(255,255,255,0.55)",
            transition: "color var(--transition-fast)",
          }} />
          <span style={{
            fontSize: "var(--text-md)", fontWeight: 500,
            overflow: "hidden", textOverflow: "ellipsis",
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateX(-6px)" : "translateX(0px)",
            maxWidth: collapsed ? "0px" : "200px",
            transition: "opacity var(--transition-sidebar), transform var(--transition-sidebar), max-width var(--transition-sidebar)",
            pointerEvents: "none",
          }}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}