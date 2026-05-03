import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  client: string;
  quantity: number;
  delivery_date: string;
  planned_start: string | null;
  state: string;
  duration_minutes: number;
  press_id: number | null;
  reference?: {
    article_code: string;
  };
}

interface Press {
  id: number;
  name: string;
  state: string;
}

const PIXELS_PER_HOUR = 100;

const getXPosition = (dateStr: string | null) => {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes();
  return h * PIXELS_PER_HOUR + m * (PIXELS_PER_HOUR / 60);
};

const Planning: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [presses, setPresses] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);

  // Day hours for header
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
  );

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/orders/"),
      axios.get("http://localhost:8000/presses/"),
    ])
      .then(([ordersRes, pressesRes]) => {
        setOrders(ordersRes.data);
        setPresses(pressesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching planning data:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-8 text-blue-500 animate-pulse font-bold flex items-center gap-3">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        Generating Production Planning...
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Presses Planning
          </h2>
          <p className="text-slate-500 font-medium">
            Real-time production workload
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="px-4 flex items-center gap-2 border-x border-slate-800">
            <CalendarDays size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
        {/* Time Scale Header */}
        <div className="flex border-b border-slate-800 bg-slate-900/80">
          <div className="w-64 p-4 border-r border-slate-800 font-black text-[10px] text-slate-500 uppercase tracking-widest flex items-center">
            Machinery
          </div>
          <div className="flex-1 overflow-x-auto flex scrollbar-hide">
            {hours.map((hour) => (
              <div
                key={hour}
                className="min-w-25 p-4 text-center border-r border-slate-800/30 text-[10px] font-bold text-slate-500"
              >
                {hour}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800 relative">
          {/* NOW Indicator Line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500 z-30 shadow-[0_0_15px_rgba(239,68,68,0.8)] pointer-events-none"
            style={{
              left: `calc(16rem + ${getXPosition(new Date().toISOString())}px)`,
            }}
          >
            <div className="bg-red-500 text-[8px] text-white font-black px-1.5 py-0.5 rounded-full absolute -top-2 -left-3 shadow-lg">
              NOW
            </div>
          </div>

          {presses.map((press) => {
            const pressOrders = orders.filter(
              (o) => o.press_id === press.id && o.planned_start !== null,
            );

            return (
              <div key={press.id} className="flex group min-h-20">
                {/* Press Label */}
                <div className="w-64 p-5 border-r border-slate-800 bg-slate-900/40 sticky left-0 z-20 backdrop-blur-md">
                  <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                    {press.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${press.state === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-600"}`}
                    />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                      {press.state}
                    </span>
                  </div>
                </div>

                {/* Grid & Blocks Area */}
                <div className="flex-1 flex relative bg-slate-950/20 overflow-x-auto">
                  {/* Grid Lines */}
                  {hours.map((_, i) => (
                    <div
                      key={i}
                      className="min-w-25 border-r border-slate-800/20 h-full"
                    />
                  ))}

                  {/* Production Blocks */}
                  {pressOrders.map((order) => {
                    const leftPx = getXPosition(order.planned_start);
                    const durationPx =
                      (order.duration_minutes / 60) * PIXELS_PER_HOUR;

                    return (
                      <div
                        key={order.id}
                        className="absolute top-4 h-12 rounded-xl border border-blue-500/40 bg-linear-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md p-2.5 flex flex-col justify-center cursor-pointer hover:scale-[1.02] hover:border-blue-300 hover:z-40 transition-all shadow-2xl group/block"
                        style={{
                          left: `${leftPx}px`,
                          width: `${durationPx}px`,
                        }}
                      >
                        <p className="text-[10px] font-black text-white truncate uppercase">
                          {order.order_number}
                        </p>
                        <p className="text-[9px] font-bold text-blue-400/80 truncate">
                          {order.reference?.article_code || "N/A"}
                        </p>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover/block:block z-50 bg-slate-800 border border-slate-700 p-3 rounded-xl text-[10px] text-white shadow-2xl w-40 animate-in fade-in slide-in-from-bottom-2">
                          <p className="font-black border-b border-slate-700 pb-1 mb-1">
                            {order.client}
                          </p>
                          <div className="flex justify-between mt-1 text-slate-400">
                            <span>Duration:</span>
                            <span className="text-blue-400 font-bold">
                              {Math.round(order.duration_minutes)} min
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Units:</span>
                            <span className="text-white font-bold">
                              {order.quantity.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Footer */}
      <div className="flex items-center gap-3 text-slate-400 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Info size={18} className="text-blue-400" />
        </div>
        <p className="text-xs font-medium leading-relaxed">
          Planning reflects estimated production times based on machine cadence.{" "}
          <br />
          <span className="text-slate-500 italic">
            Unscheduled orders are hidden from this view.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Planning;
