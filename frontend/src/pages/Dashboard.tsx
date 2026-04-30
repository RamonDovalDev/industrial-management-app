import axios from "axios";
import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  AlertTriangle,
  BarChart3,
  Box,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  client: string;
  quantity: number;
  delivery_date: string;
  state: string;
  duration_minutes: number;
  reference?: {
    article_code: string;
    description: string;
  };
}

interface Press {
  id: string;
  name: string;
  state: string;
}

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [presses, setPresses] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Presses and orders in parallel
    Promise.all([
      axios.get("http://localhost:8000/orders/"),
      axios.get("http://localhost:8000/presses/"),
    ])
      .then(([ordersRes, pressesRes]) => {
        setOrders(ordersRes.data);
        setPresses(pressesRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-8 text-blue-500 animate-pulse font-bold">
        Loading View Pointer...
      </div>
    );

  // KPI's
  const totalOrders = orders.length;
  const activePresses = presses.filter((p) => p.state === "active").length;
  const pendingOrders = orders.filter((o) => o.state === "pending").length;

  // Alerts (orders with delivery in less than 3 days)
  const urgentOrders = orders.filter((o) => {
    const diff = new Date(o.delivery_date).getTime() - new Date().getTime();
    return diff < 3 * 24 * 60 * 60 * 1000 && o.state !== "finished";
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Control Panel
        </h2>
        <p className="text-slate-500 font-medium">
          Current state of the plant in real-time
        </p>
      </div>

      {/* KPI's Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<Box className="text-blue-500" />}
          color="blue"
        />
        <StatCard
          title="Active Presses"
          value={`${activePresses}/${presses.length}`}
          icon={<BarChart3 className="text-emerald-500" />}
          color="emerald"
        />
        <StatCard
          title="Pending"
          value={pendingOrders}
          icon={<Clock className="text-amber-500" />}
          color="amber"
        />
        <StatCard
          title="Critical Alerts"
          value={urgentOrders.length}
          icon={<AlertTriangle className="text-rose-500" />}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              Next Deliveries
            </h3>
            <button className="tezt-xs font-bold text-blue-500 hover:underline">
              See All
            </button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-white">
                    {order.order_number} - {order.client}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order.reference?.article_code} .{" "}
                    {Math.round(order.duration_minutes / 60)}h production
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-400">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.state === "pending" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}
                  >
                    {order.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-rose-500 flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
          </h3>
          <div className="space-y-4">
            {urgentOrders.length > 0 ? (
              urgentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20"
                >
                  <p className="text-sm font-bold text-rose-200">
                    Imminent Delivery
                  </p>
                  <p className="text-xs text-rose-300/70">
                    {order.order_number} from {order.client} is approaching.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">
                There's no critical alerts today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
