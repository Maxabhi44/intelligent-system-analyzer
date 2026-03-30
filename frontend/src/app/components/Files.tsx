import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, FileText, Image, Package, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { useOutletContext } from "react-router";

export function Files() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["temp"]);
  const { setSelectedItem } = useOutletContext<any>();

  const fileGroups = [
    {
      id: "temp",
      title: "Temporary Files",
      icon: FileText,
      color: "blue",
      size: "1.2 GB",
      count: 453,
      description: "Cache and temporary files safe to remove",
      confidence: 95,
      files: [
        { name: "Safari Cache", size: "342 MB", lastUsed: "2 days ago", safe: true },
        { name: "Chrome Session Data", size: "128 MB", lastUsed: "Today", safe: true },
        { name: "System Temp Files", size: "567 MB", lastUsed: "5 days ago", safe: true },
        { name: "Application Logs", size: "89 MB", lastUsed: "1 week ago", safe: true },
      ]
    },
    {
      id: "large",
      title: "Large Files",
      icon: Package,
      color: "purple",
      size: "8.7 GB",
      count: 23,
      description: "Files over 100MB that might need review",
      confidence: 88,
      files: [
        { name: "video_project_final.mov", size: "2.3 GB", lastUsed: "3 weeks ago", safe: false },
        { name: "dataset_backup.zip", size: "1.8 GB", lastUsed: "2 months ago", safe: false },
        { name: "old_presentation.pptx", size: "456 MB", lastUsed: "45 days ago", safe: false },
        { name: "archive_2023.dmg", size: "3.2 GB", lastUsed: "4 months ago", safe: false },
      ]
    },
    {
      id: "unused",
      title: "Old & Unused Files",
      icon: Calendar,
      color: "yellow",
      size: "1.2 GB",
      count: 312,
      description: "Not accessed in the last 90 days",
      confidence: 82,
      files: [
        { name: "old_documents", size: "234 MB", lastUsed: "120 days ago", safe: false },
        { name: "archived_photos", size: "567 MB", lastUsed: "95 days ago", safe: false },
        { name: "unused_fonts", size: "45 MB", lastUsed: "180 days ago", safe: true },
        { name: "temp_downloads", size: "312 MB", lastUsed: "150 days ago", safe: true },
      ]
    },
  ];

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Smart File View</h2>
        <p className="text-white/50">Files organized by intelligent insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Found" value="11.1 GB" sublabel="788 items" />
        <StatCard label="Safe to Clean" value="2.4 GB" sublabel="465 items" color="green" />
        <StatCard label="Needs Review" value="8.7 GB" sublabel="323 items" color="yellow" />
      </div>

      {/* File Groups */}
      <div className="space-y-4">
        {fileGroups.map((group) => (
          <FileGroup
            key={group.id}
            group={group}
            isExpanded={expandedGroups.includes(group.id)}
            onToggle={() => toggleGroup(group.id)}
            onFileClick={(file) => setSelectedItem({ ...file, group: group.title })}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, color = "blue" }: any) {
  const colorClasses = {
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
      <div className={`text-3xl font-bold ${colorClasses[color as keyof typeof colorClasses]} mb-1`}>
        {value}
      </div>
      <div className="text-white/40 text-xs">{sublabel}</div>
    </motion.div>
  );
}

function FileGroup({ group, isExpanded, onToggle, onFileClick }: any) {
  const Icon = group.icon;
  
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      icon: "text-blue-400"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      icon: "text-purple-400"
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      icon: "text-yellow-400"
    },
  };

  const colors = colorClasses[group.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-3xl border ${colors.border} overflow-hidden`}
    >
      {/* Group Header */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${colors.bg}`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
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
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-white/40" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded File List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="p-4 space-y-2">
              {group.files.map((file: any, index: number) => (
                <FileItem 
                  key={index} 
                  file={file} 
                  color={colors}
                  onClick={() => onFileClick(file)}
                />
              ))}
            </div>

            <div className="p-4 border-t border-white/5 flex gap-3">
              <button className={`flex-1 py-3 rounded-xl ${colors.bg} ${colors.text} font-medium text-sm transition-all duration-200 hover:brightness-125`}>
                Review All
              </button>
              {group.id === "temp" && (
                <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-200 hover:shadow-lg">
                  Clean All
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FileItem({ file, color, onClick }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-3 flex-1">
        <FileText className="w-5 h-5 text-white/40" />
        <div>
          <div className="text-white font-medium text-sm">{file.name}</div>
          <div className="text-white/40 text-xs">Last used: {file.lastUsed}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-white/60 text-sm font-mono">{file.size}</div>
        {file.safe && (
          <div className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-lg">
            <CheckCircle2 className="w-3 h-3" />
            Safe
          </div>
        )}
        <Trash2 className="w-4 h-4 text-white/20 group-hover:text-red-400 transition-colors" />
      </div>
    </motion.div>
  );
}
