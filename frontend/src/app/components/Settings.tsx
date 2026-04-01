import { useState } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Zap, Brain, Layers, Shield, Code2 } from "lucide-react";

export function Settings() {
  const [scanMode, setScanMode] = useState("smart");
  const [developerMode, setDeveloperMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div
      className="min-h-screen"
      style={{ padding: "var(--space-xl)" }}
    >
      {/* Header */}
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <div
          className="flex items-center"
          style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}
        >
          <SettingsIcon
            style={{ width: "var(--icon-xl)", height: "var(--icon-xl)" }}
            className="text-blue-400"
          />
          <h2
            className="font-semibold text-white"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Settings
          </h2>
        </div>
        <p
          className="text-white/50"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Customize ISA to work your way
        </p>
      </div>

      <div
        style={{
          maxWidth: "var(--content-max-w)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
        }}
      >
        {/* Scan Modes */}
        <Section title="Scan Modes" description="Choose how ISA analyzes your system">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <ScanModeOption
              id="quick"
              icon={Zap}
              title="Quick Scan"
              description="Fast surface-level scan (2-3 minutes)"
              isSelected={scanMode === "quick"}
              onClick={() => setScanMode("quick")}
              color="yellow"
            />
            <ScanModeOption
              id="smart"
              icon={Brain}
              title="Smart Scan"
              description="AI-powered intelligent analysis (5-7 minutes)"
              isSelected={scanMode === "smart"}
              onClick={() => setScanMode("smart")}
              color="blue"
              recommended
            />
            <ScanModeOption
              id="deep"
              icon={Layers}
              title="Deep Scan"
              description="Comprehensive system analysis (10-15 minutes)"
              isSelected={scanMode === "deep"}
              onClick={() => setScanMode("deep")}
              color="purple"
            />
          </div>
        </Section>

        {/* Features */}
        <Section title="Features" description="Enable or disable advanced features">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <ToggleOption
              icon={Code2}
              title="Developer Mode"
              description="Show advanced project analysis and dev tools"
              isEnabled={developerMode}
              onChange={setDeveloperMode}
              color="purple"
            />
          </div>
        </Section>

        {/* Safety Settings */}
        <Section title="Safety & Security" description="Protect your important data">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <ToggleOption
              icon={Shield}
              title="Enable Backup Before Delete"
              description="Automatically backup files before permanent deletion"
              isEnabled={autoBackup}
              onChange={setAutoBackup}
              color="green"
            />
            <ToggleOption
              icon={SettingsIcon}
              title="Smart Notifications"
              description="Get alerts about system health and optimization opportunities"
              isEnabled={notifications}
              onChange={setNotifications}
              color="blue"
            />
          </div>
        </Section>

        {/* About */}
        <Section title="About" description="Application information">
          <div
            className="glass-card rounded-2xl"
            style={{ padding: "var(--card-padding)" }}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <div>
                <div
                  className="text-white font-semibold"
                  style={{
                    fontSize: "var(--text-base)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  Intelligent System Analyzer
                </div>
                <div
                  className="text-white/60"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  Version 2.0.1
                </div>
              </div>
              <div
                className="text-white/40 bg-white/5 rounded-lg"
                style={{
                  fontSize: "var(--text-xs)",
                  paddingLeft: "var(--space-sm)",
                  paddingRight: "var(--space-sm)",
                  paddingTop: "var(--space-xs)",
                  paddingBottom: "var(--space-xs)",
                }}
              >
                Up to date
              </div>
            </div>
            <div
              className="text-white/50"
              style={{ fontSize: "var(--text-sm)" }}
            >
              © 2026 ISA. AI-powered system intelligence tool.
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, description, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl"
      style={{ padding: "var(--card-padding)" }}
    >
      <div style={{ marginBottom: "var(--space-md)" }}>
        <h3
          className="font-semibold text-white"
          style={{
            fontSize: "var(--text-xl)",
            marginBottom: "var(--space-xs)",
          }}
        >
          {title}
        </h3>
        <p
          className="text-white/50"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {description}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function ScanModeOption({ id, icon: Icon, title, description, isSelected, onClick, color, recommended }: any) {
  const colorClasses = {
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: "text-yellow-400",
      glow: "shadow-yellow-500/20",
      dot: "bg-yellow-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      glow: "shadow-blue-500/20",
      dot: "bg-blue-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      icon: "text-purple-400",
      glow: "shadow-purple-500/20",
      dot: "bg-purple-400",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? `${colors.border} ${colors.bg} shadow-lg ${colors.glow}`
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
      style={{ padding: "var(--space-sm)" }}
    >
      {recommended && (
        <div
          className="absolute -top-2 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full"
          style={{
            fontSize: "var(--text-xs)",
            paddingLeft: "var(--space-xs)",
            paddingRight: "var(--space-xs)",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          Recommended
        </div>
      )}

      <div
        className="flex items-center"
        style={{ gap: "var(--space-sm)" }}
      >
        <div className={`rounded-xl ${isSelected ? colors.bg : "bg-white/5"}`}
          style={{ padding: "var(--space-sm)" }}
        >
          <Icon
            style={{ width: "var(--icon-lg)", height: "var(--icon-lg)" }}
            className={isSelected ? colors.icon : "text-white/40"}
          />
        </div>

        <div className="flex-1">
          <div
            className="text-white font-medium"
            style={{
              fontSize: "var(--text-base)",
              marginBottom: "var(--space-xs)",
            }}
          >
            {title}
          </div>
          <div
            className="text-white/60"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {description}
          </div>
        </div>

        {/* Radio dot */}
        <div
          className={`rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected ? `${colors.border} ${colors.bg}` : "border-white/20"
          }`}
          style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`rounded-full ${colors.dot}`}
              style={{ width: "var(--space-xs)", height: "var(--space-xs)" }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ToggleOption({ icon: Icon, title, description, isEnabled, onChange, color }: any) {
  const colorClasses = {
    purple: { bg: "bg-purple-500/10", icon: "text-purple-400" },
    green: { bg: "bg-green-500/10", icon: "text-green-400" },
    blue: { bg: "bg-blue-500/10", icon: "text-blue-400" },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <div
      className="flex items-center rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200"
      style={{
        gap: "var(--space-sm)",
        padding: "var(--space-sm)",
      }}
    >
      <div className={`rounded-xl ${colors.bg}`} style={{ padding: "var(--space-sm)" }}>
        <Icon
          style={{ width: "var(--icon-lg)", height: "var(--icon-lg)" }}
          className={colors.icon}
        />
      </div>

      <div className="flex-1">
        <div
          className="text-white font-medium"
          style={{
            fontSize: "var(--text-base)",
            marginBottom: "var(--space-xs)",
          }}
        >
          {title}
        </div>
        <div
          className="text-white/60"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {description}
        </div>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={() => onChange(!isEnabled)}
        className={`relative rounded-full transition-all duration-300 flex-shrink-0 ${
          isEnabled ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/10"
        }`}
        style={{ width: "3.5rem", height: "2rem" }}
      >
        <motion.div
          animate={{ x: isEnabled ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 bg-white rounded-full shadow-lg"
          style={{ width: "1.5rem", height: "1.5rem" }}
        />
      </button>
    </div>
  );
}