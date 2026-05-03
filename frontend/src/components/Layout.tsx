import {
  Bell,
  ClipboardList,
  GanttChart,
  LayoutDashboard,
  Settings,
  Zap,
} from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();
  const menuItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/planning", icon: <GanttChart size={20} />, label: "Planning" },
    { path: "/orders", icon: <ClipboardList size={20} />, label: "Orders" },
    { path: "/simulator", icon: <Zap size={20} />, label: "Simulator" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-slate-200 font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-800/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              Ind-Mng
            </h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="font-semibold">Configuration</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/20 px-8 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              "Vista"}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 border border-white/10 shadow-lg"></div>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
