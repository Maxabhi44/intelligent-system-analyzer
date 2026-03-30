import { useState } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Zap, Brain, Layers, Shield, Code2 } from "lucide-react";

export function Settings() {
  const [scanMode, setScanMode] = useState("smart");
  const [developerMode, setDeveloperMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-semibold text-white">Settings</h2>
        </div>
        <p className="text-white/50">Customize ISA to work your way</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Scan Modes */}
        <Section title="Scan Modes" description="Choose how ISA analyzes your system">
          <div className="space-y-3">
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
          <div className="space-y-3">
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
          <div className="space-y-3">
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
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold mb-1">Intelligent System Analyzer</div>
                <div className="text-white/60 text-sm">Version 2.0.1</div>
              </div>
              <div className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-lg">
                Up to date
              </div>
            </div>
            <div className="text-white/50 text-sm">
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
      className="glass-card p-6 rounded-3xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        <p className="text-white/50 text-sm">{description}</p>
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
      glow: "shadow-yellow-500/20"
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      glow: "shadow-blue-500/20"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      icon: "text-purple-400",
      glow: "shadow-purple-500/20"
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? `${colors.border} ${colors.bg} shadow-lg ${colors.glow}`
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      {recommended && (
        <div className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
          Recommended
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isSelected ? colors.bg : "bg-white/5"}`}>
          <Icon className={`w-6 h-6 ${isSelected ? colors.icon : "text-white/40"}`} />
        </div>
        
        <div className="flex-1">
          <div className="text-white font-medium mb-1">{title}</div>
          <div className="text-white/60 text-sm">{description}</div>
        </div>

        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected ? `${colors.border} ${colors.bg}` : "border-white/20"
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-2.5 h-2.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`}
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
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
      <div className={`p-3 rounded-xl ${colors.bg}`}>
        <Icon className={`w-6 h-6 ${colors.icon}`} />
      </div>
      
      <div className="flex-1">
        <div className="text-white font-medium mb-1">{title}</div>
        <div className="text-white/60 text-sm">{description}</div>
      </div>

      <button
        onClick={() => onChange(!isEnabled)}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
          isEnabled ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/10"
        }`}
      >
        <motion.div
          animate={{ x: isEnabled ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
