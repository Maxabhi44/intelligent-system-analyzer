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
      framework: "React",
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
      framework: "Vue",
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
      framework: "Django",
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
      framework: "Next.js",
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
      framework: "Angular",
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
      framework: "TensorFlow",
    },
  ];

  const stats = {
    totalProjects: projects.length,
    totalSize: "10.8 GB",
    activeProjects: projects.filter((p) => p.status === "active").length,
    canClean: "4.8 GB",
  };

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
          <Code2
            style={{ width: "var(--icon-xl)", height: "var(--icon-xl)" }}
            className="text-purple-400"
          />
          <h2
            className="font-semibold text-white"
            style={{ fontSize: "var(--text-hero)" }}
          >
            Developer Mode
          </h2>
        </div>
        <p
          className="text-white/50"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Intelligent project analysis for developers
        </p>
      </div>

      {/* Stats Overview */}
      <div
        className="grid grid-cols-4"
        style={{
          gap: "var(--space-md)",
          marginBottom: "var(--space-lg)",
        }}
      >
        <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderGit2} color="blue" />
        <StatCard label="Total Size" value={stats.totalSize} icon={HardDrive} color="purple" />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={Code2} color="green" />
        <StatCard label="Can Clean" value={stats.canClean} icon={Trash2} color="yellow" />
      </div>

      {/* Projects Grid */}
      <div
        className="grid grid-cols-2"
        style={{ gap: "var(--space-md)" }}
      >
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
      className="glass-card rounded-2xl"
      style={{ padding: "var(--card-padding)" }}
    >
      <div
        className={`inline-flex rounded-xl ${colors.bg}`}
        style={{
          padding: "var(--space-xs)",
          marginBottom: "var(--space-sm)",
        }}
      >
        <Icon
          style={{ width: "var(--icon-md)", height: "var(--icon-md)" }}
          className={colors.text}
        />
      </div>
      <div
        className="text-white/60"
        style={{
          fontSize: "var(--text-sm)",
          marginBottom: "var(--space-xs)",
        }}
      >
        {label}
      </div>
      <div
        className={`font-bold ${colors.text}`}
        style={{ fontSize: "var(--text-xl)" }}
      >
        {value}
      </div>
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
      className={`glass-card rounded-3xl border ${status.border} transition-all duration-300 hover:shadow-xl hover:shadow-white/5`}
      style={{ padding: "var(--card-padding)" }}
    >
      {/* Card Header */}
      <div
        className="flex items-start justify-between"
        style={{ marginBottom: "var(--space-sm)" }}
      >
        <div
          className="flex items-center"
          style={{ gap: "var(--space-sm)" }}
        >
          <div className={`rounded-2xl ${status.bg}`} style={{ padding: "var(--space-sm)" }}>
            <FolderGit2
              style={{ width: "var(--icon-lg)", height: "var(--icon-lg)" }}
              className={status.color}
            />
          </div>
          <div>
            <h3
              className="font-semibold text-white"
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {project.name}
            </h3>
            <div
              className="text-white/40 font-mono"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {project.framework}
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg ${status.bg} ${status.color} font-medium`}
          style={{
            fontSize: "var(--text-xs)",
            paddingLeft: "var(--space-sm)",
            paddingRight: "var(--space-sm)",
            paddingTop: "var(--space-xs)",
            paddingBottom: "var(--space-xs)",
          }}
        >
          {status.label}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-2"
        style={{
          gap: "var(--space-xs)",
          marginBottom: "var(--space-sm)",
        }}
      >
        {[
          { label: "Total Size", value: project.size, valueClass: "text-white" },
          { label: "Build Files", value: project.buildSize, valueClass: "text-white" },
          { label: "node_modules", value: project.nodeModules, valueClass: "text-yellow-400" },
          { label: "Dependencies", value: project.dependencies, valueClass: "text-white" },
        ].map(({ label, value, valueClass }) => (
          <div
            key={label}
            className="bg-white/5 rounded-xl"
            style={{ padding: "var(--space-sm)" }}
          >
            <div
              className="text-white/40"
              style={{
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {label}
            </div>
            <div
              className={`font-semibold ${valueClass}`}
              style={{ fontSize: "var(--text-base)" }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Path */}
      <div
        className="bg-white/5 rounded-xl"
        style={{
          padding: "var(--space-sm)",
          marginBottom: "var(--space-sm)",
        }}
      >
        <div
          className="text-white/40"
          style={{
            fontSize: "var(--text-xs)",
            marginBottom: "var(--space-xs)",
          }}
        >
          Path
        </div>
        <div
          className="text-white/60 font-mono truncate"
          style={{ fontSize: "var(--text-xs)" }}
        >
          {project.path}
        </div>
      </div>

      {/* Last Modified */}
      <div
        className="text-white/40"
        style={{
          fontSize: "var(--text-xs)",
          marginBottom: "var(--space-sm)",
        }}
      >
        Last modified: {project.lastModified}
      </div>

      {/* Actions */}
      <div
        className="flex"
        style={{ gap: "var(--space-xs)" }}
      >
        <button
          className="flex-1 rounded-xl bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-all duration-200 flex items-center justify-center"
          style={{
            fontSize: "var(--text-sm)",
            gap: "var(--space-xs)",
            paddingTop: "var(--btn-py)",
            paddingBottom: "var(--btn-py)",
          }}
        >
          <Package style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
          Clean Build
        </button>

        {project.status === "dead" && (
          <button
            className="flex-1 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center"
            style={{
              fontSize: "var(--text-sm)",
              gap: "var(--space-xs)",
              paddingTop: "var(--btn-py)",
              paddingBottom: "var(--btn-py)",
            }}
          >
            <Archive style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
            Archive
          </button>
        )}

        {project.status === "inactive" && (
          <button
            className="flex-1 rounded-xl bg-purple-500/10 text-purple-400 font-medium hover:bg-purple-500/20 transition-all duration-200 flex items-center justify-center"
            style={{
              fontSize: "var(--text-sm)",
              gap: "var(--space-xs)",
              paddingTop: "var(--btn-py)",
              paddingBottom: "var(--btn-py)",
            }}
          >
            <Archive style={{ width: "var(--icon-sm)", height: "var(--icon-sm)" }} />
            Archive
          </button>
        )}
      </div>
    </motion.div>
  );
}