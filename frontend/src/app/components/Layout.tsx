import { Outlet, NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Scan as ScanIcon, 
  FolderOpen, 
  Code2, 
  Settings as SettingsIcon 
} from "lucide-react";
import { useState } from "react";
import { DetailPanel } from "./DetailPanel";

export function Layout() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="h-screen w-screen bg-[#0F172A] overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-semibold text-white mb-1">ISA</h1>
          <p className="text-sm text-white/50">Intelligent System Analyzer</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/scan" icon={ScanIcon} label="Scan" />
          <NavItem to="/files" icon={FolderOpen} label="Files" />
          <NavItem to="/developer" icon={Code2} label="Developer Mode" />
          <NavItem to="/settings" icon={SettingsIcon} label="Settings" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-white/30">Version 2.0.1</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ setSelectedItem }} />
      </main>

      {/* Right Detail Panel */}
      {selectedItem && (
        <DetailPanel 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
          isActive
            ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}
