import React from "react";
import {
  LayoutDashboard,
  GanttChartSquare,
  ClipboardList,
  FlaskConical,
  Bell,
  Activity,
  Settings,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  // Definición de las rutas principales de navegación
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/planning", icon: GanttChartSquare, label: "Planning" },
    { path: "/orders", icon: ClipboardList, label: "Orders" },
    { path: "/simulator", icon: FlaskConical, label: "Simulator" },
  ];

  return (
    // Contenedor principal que ocupa exactamente el 100% de la ventana (h-screen)
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      {/* --- TOP HEADER --- */}
      <header className="h-14 flex items-center justify-between px-4 bg-gray-950 border-b border-gray-800 z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo animado / Icono principal */}
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.5)]">
            <Activity size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide text-gray-100 uppercase">
            Industrial Management
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection status to the Backend (Simulated in UI) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium text-gray-400">
              API Connected
            </span>
          </div>

          {/* Notifications Bell / Alerts */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-gray-950" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 border border-gray-700 cursor-pointer" />
        </div>
      </header>

      {/* --- LOWER CONTAINER (SIDEBAR + MAIN) --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 gap-6 z-10 shrink-0">
          <nav className="w-full flex flex-col gap-2 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/10 text-blue-500 shadow-[inset_2px_0_0_0_rgba(59,130,246,1)]"
                      : "text-gray-500 hover:bg-gray-900 hover:text-gray-300"
                  }`
                }
              >
                <item.icon size={22} strokeWidth={1.5} />

                {/* Emerging Tooltip when hover */}
                <div className="absolute left-14 px-2 py-1 bg-gray-800 text-gray-200 text-xs font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-700 shadow-xl">
                  {item.label}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Configuration Button */}
          <div className="w-full mt-auto px-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-500 shadow-[inset_2px_0_0_0_rgba(59,130,246,1)]"
                    : "text-gray-500 hover:bg-gray-900 hover:text-gray-300"
                }`
              }
            >
              <Settings size={22} strokeWidth={1.5} />
              <div className="absolute left-14 px-2 py-1 bg-gray-800 text-gray-200 text-xs font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-700 shadow-xl">
                Configuration
              </div>
            </NavLink>
          </div>
        </aside>

        {/* --- MAIN AREA --- */}
        <main className="flex-1 bg-[#10101a] overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
