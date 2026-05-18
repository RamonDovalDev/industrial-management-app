import axios from "axios";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  Clock,
  Info,
  Settings2,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface DashboardStats {
  active_orders: number;
  active_presses: number;
  mold_changes_week: number;
  orders_at_risk: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Because it's V1, simulate data aggregation fetching current endpoints
    // In final verssion, FastAPI Backend might have a specific "dashboard/summary" endpoint
    Promise.all([
      axios.get("http://localhost:8000/orders/"),
      axios.get("http://localhost:8000/presses/"),
    ])
      .then(([ordersRes, pressesRes]) => {
        const orders = ordersRes.data;
        const presses = pressesRes.data;

        const activeOrders = orders.filter(
          (o: any) => o.state === "in_progress",
        ).length;
        const activePresses = presses.filter(
          (p: any) => p.state === "active",
        ).length;

        // Simulate risk deadlines calculation (deliveries in less than 3 days)
        const today = new Date().getTime();
        const atRisk = orders.filter((o: any) => {
          const diff = new Date(o.delivery_date).getTime() - today;
          return diff < 3 * 24 * 60 * 60 * 1000;
        }).length;

        setStats({
          active_orders: activeOrders || orders.length, // Fallback if there's no "in_progress" state
          active_presses: activePresses || presses.length,
          mold_changes_week: 12, // Simulated date at now
          orders_at_risk: atRisk,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    // "max-w" to ensure good readibility at Ultra-Wide factory monitors
    <div className="p-8 max-w-400 mx-auto h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl text-gray-100 font-black tracking-tight">
            Control Panel
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Current week view and real-time alerts
          </p>
        </div>
        {/* Self-actualization Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg shadow-inner">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Live Sync
          </span>
        </div>
      </div>

      {/* --- BLOCK 1: KPIs (Key Performance Indicators) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {/* KPI 1: Active Orders */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <TrendingUp size={100} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="text-blue-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Active Orders
            </h3>
          </div>
          <p className="text-4xl font-black text-gray-100 relative z-10">
            {stats?.active_orders}
          </p>
        </div>
        {/* KP2: Active Presses */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Settings2 size={100} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Settings2 className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Operative Presses
            </h3>
          </div>
          <p className="text-4xl font-black text-gray-100 relative z-10">
            {stats?.active_presses}
          </p>
        </div>
        {/* KP3: Mold Change */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Clock size={100} className="text-purple-500" />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Clock className="text-purple-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Mold Change
            </h3>
          </div>
          <p className="text-4xl font-black text-gray-100 relative z-10">
            {stats?.mold_changes_week}{" "}
            <span className="text-sm text-gray-500 font-medium">
              this week.
            </span>
          </p>
        </div>
        {/* KP4: Alert/Risk */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <AlertTriangle size={100} className="text-red-500" />
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="text-purple-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Risk Period
            </h3>
          </div>
          <p className="text-4xl font-black text-gray-100 relative z-10">
            {stats?.orders_at_risk}
          </p>
        </div>
      </div>

      {/* --- BLOCK 2: GRAPHICS AND ALERTS --- */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-100">
        {/* Left Section: Graphic/Load Summary */}
        <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
            <CalendarDays size={20} className="text-blue-500" />
            Weekly Load
          </h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg bg-gray-950/50 text-gray-500 hover:bg-gray-700 transition-colors">
            {/* Container prepared to inject a graphics library */}
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Visual module under contruction
              </p>
              <p className="text-sm mt-1 text-gray-600">
                Reserved Area for productive workload bar chart
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Critical Alerts Log */}
        <div className="w-full lg:w-96 bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-100 flexitems-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              Active Alerts
            </h3>
            {/* Label with red alerts count */}
            <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-2.5 py-1 rounded border border-red-500/30">
              {stats?.orders_at_risk} CRITICAL
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {/* ALERT EXAMPLE: Inminent Delay (Red) */}
            <div className="p-4 border border-red-500/20 bg-red-950/20 rounded-lg hover:border-red-500/40 transition-colors cursor-default">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="text-red-500 mt-0.5 shrink-0"
                />
                <div>
                  <h4 className="text-[13px] font-bold text-gray-200">
                    Order ORD-004 at risk
                  </h4>
                  <p className="text-[11px] text-red-400/80 mt-1 leading-snug">
                    Order scheduled in less than 48h and production has not yet
                    begun
                  </p>
                </div>
              </div>
            </div>
            {/* ALERT EXAMPLE: Maintenance (Amber) */}
            <div className="p-4 border border-amber-500/20 bg-amber-950/20 rounded-lg hover:border-amber-500/40 transition-colors cursor-default">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[13px] font-bold text-gray-200">
                    Maintenance Press 3
                  </h4>
                  <p className="text-[11px] text-amber-400/80 mt-1 leading-snug">
                    Close to operative 500h limit. Requires revision de engrase.
                  </p>
                </div>
              </div>
            </div>
            {/* ALERT EXAMPLE: Maintenance (Amber) */}
            <div className="p-4 border border-blue-500/20 bg-blue-950/20 rounded-lg hover:border-blue-500/40 transition-colors cursor-default">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[13px] font-bold text-gray-200">
                    Sincronized MBC Data
                  </h4>
                  <p className="text-[11px] text-blue-400/80 mt-1 leading-snug">
                    Imported 12 new orders from the server successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
