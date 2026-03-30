import { motion } from "motion/react";
import { Code2, FolderGit2, Package, Archive, Trash2, HardDrive } from "lucide-react";

export function DeveloperMode() {
  const projects = [
    {
      id: 1,
      name: "ecommerce-app",
      path: "/Users/dev/projects/ecommerce-app",
      size: "1.2 GB",
      status: "active",
      lastModified: "2 days ago",
      buildSize: "456 MB",
      nodeModules: "678 MB",
      dependencies: 234,
      language: "TypeScript",
      framework: "React"
    },
    {
      id: 2,
      name: "mobile-dashboard",
      path: "/Users/dev/projects/mobile-dashboard",
      size: "890 MB",
      status: "inactive",
      lastModified: "3 weeks ago",
      buildSize: "234 MB",
      nodeModules: "543 MB",
      dependencies: 189,
      language: "JavaScript",
      framework: "Vue"
    },
    {
      id: 3,
      name: "legacy-api",
      path: "/Users/dev/projects/legacy-api",
      size: "2.3 GB",
      status: "dead",
      lastModified: "6 months ago",
      buildSize: "1.2 GB",
      nodeModules: "987 MB",
      dependencies: 456,
      language: "Python",
      framework: "Django"
    },
    {
      id: 4,
      name: "data-visualization",
      path: "/Users/dev/projects/data-visualization",
      size: "567 MB",
      status: "active",
      lastModified: "Yesterday",
      buildSize: "123 MB",
      nodeModules: "342 MB",
      dependencies: 98,
      language: "TypeScript",
      framework: "Next.js"
    },
    {
      id: 5,
      name: "old-portfolio",
      path: "/Users/dev/projects/old-portfolio",
      size: "1.5 GB",
      status: "dead",
      lastModified: "1 year ago",
      buildSize: "890 MB",
      nodeModules: "456 MB",
      dependencies: 312,
      language: "JavaScript",
      framework: "Angular"
    },
    {
      id: 6,
      name: "ml-experiments",
      path: "/Users/dev/projects/ml-experiments",
      size: "3.4 GB",
      status: "inactive",
      lastModified: "2 months ago",
      buildSize: "2.1 GB",
      nodeModules: "0 MB",
      dependencies: 67,
      language: "Python",
      framework: "TensorFlow"
    },
  ];

  const stats = {
    totalProjects: projects.length,
    totalSize: "10.8 GB",
    activeProjects: projects.filter(p => p.status === "active").length,
    canClean: "4.8 GB",
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-semibold text-white">Developer Mode</h2>
        </div>
        <p className="text-white/50">Intelligent project analysis for developers</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Projects" 
          value={stats.totalProjects} 
          icon={FolderGit2}
          color="blue"
        />
        <StatCard 
          label="Total Size" 
          value={stats.totalSize} 
          icon={HardDrive}
          color="purple"
        />
        <StatCard 
          label="Active Projects" 
          value={stats.activeProjects} 
          icon={Code2}
          color="green"
        />
        <StatCard 
          label="Can Clean" 
          value={stats.canClean} 
          icon={Trash2}
          color="yellow"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  const colorClasses = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
    green: { bg: "bg-green-500/10", text: "text-green-400" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className={`inline-flex p-2 rounded-xl ${colors.bg} mb-3`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <div className="text-white/60 text-sm mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colors.text}`}>{value}</div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: any) {
  const statusConfig = {
    active: {
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      label: "Active",
    },
    inactive: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      label: "Inactive",
    },
    dead: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "Dead",
    },
  };

  const status = statusConfig[project.status as keyof typeof statusConfig];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`glass-card p-6 rounded-3xl border ${status.border} transition-all duration-300 hover:shadow-xl hover:shadow-white/5`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${status.bg}`}>
            <FolderGit2 className={`w-6 h-6 ${status.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
            <div className="text-xs text-white/40 font-mono">{project.framework}</div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-lg ${status.bg} ${status.color} text-xs font-medium`}>
          {status.label}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/40 text-xs mb-1">Total Size</div>
          <div className="text-white font-semibold">{project.size}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/40 text-xs mb-1">Build Files</div>
          <div className="text-white font-semibold">{project.buildSize}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/40 text-xs mb-1">node_modules</div>
          <div className="text-yellow-400 font-semibold">{project.nodeModules}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/40 text-xs mb-1">Dependencies</div>
          <div className="text-white font-semibold">{project.dependencies}</div>
        </div>
      </div>

      {/* Path */}
      <div className="bg-white/5 rounded-xl p-3 mb-4">
        <div className="text-white/40 text-xs mb-1">Path</div>
        <div className="text-white/60 text-xs font-mono truncate">{project.path}</div>
      </div>

      {/* Last Modified */}
      <div className="text-white/40 text-xs mb-4">
        Last modified: {project.lastModified}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 font-medium text-sm hover:bg-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2">
          <Package className="w-4 h-4" />
          Clean Build
        </button>
        {project.status === "dead" && (
          <button className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2">
            <Archive className="w-4 h-4" />
            Archive
          </button>
        )}
        {project.status === "inactive" && (
          <button className="flex-1 py-2.5 rounded-xl bg-purple-500/10 text-purple-400 font-medium text-sm hover:bg-purple-500/20 transition-all duration-200 flex items-center justify-center gap-2">
            <Archive className="w-4 h-4" />
            Archive
          </button>
        )}
      </div>
    </motion.div>
  );
}
