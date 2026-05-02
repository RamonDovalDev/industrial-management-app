import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  client: string;
  quantity: number;
  delivery_date: string;
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

const Planning: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [presses, setPresses] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/orders/"),
      axios.get("http://localhost:8000/presses/"),
    ]).then(([ordersRes, pressesRes]) => {
      setOrders(ordersRes.data);
      setPresses(pressesRes.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="p-8 text-blue-500 animate-pulse font-bold">
        Generating Production Planning...
      </div>
    );

  // Generamos las horas del día para la cabecera (00:00 a 23:00)
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Planning Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Presses Planning
          </h2>
          <p className="text-slate-500 font-medium">Workload for daily view</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="px-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-white">
              TODAY, {new Date().toLocaleDateString()}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
        {/* Legend and Time Scale */}
        <div className="flex border-b border-slate-800">
          <div className="w-64 p-4 border-r border-slate-800 bg-slate-800/20 font-bold text-xs text-slate-500 uppercase tracking-widest">
            Maquinaria
          </div>
          <div className="flex-1 overflow-x-auto flex bg-slate-800/10">
            {hours.map((hour) => (
              <div
                key={hour}
                className="min-w-25 p-4 text-center border-r border-slate-800/50 text-[10px] font-bold text-slate-500"
              >
                {hour}
              </div>
            ))}
          </div>
        </div>

        {/* Presses rows */}
        <div className="divide-y divide-slate-800">
          {presses.map((press) => {
            // Filter orders assignes to this press
            const pressOrders = orders.filter((o) => o.press_id === press.id);

            return (
              <div key={press.id} className="flex group">
                {/* Info de la Prensa */}
                <div className="w-64 p-6 border-r border-slate-800 bg-slate-900/80 sticky left-0 z-10">
                  <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                    {press.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${press.state === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-600"}`}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {press.state}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 flex relative overflow-x-auto bg-slate-950/20">
                  {/* Background Grid: Vertical Lines */}
                  {hours.map((_, i) => (
                    <div
                      key={i}
                      className="min-w-25 border-r border-slate-800/30 h-full"
                    ></div>
                  ))}

                  {/* Production Blocks (Simulated for initial visualization) */}
                  {pressOrders.map((order, idx) => {
                    // Positioning simulation: first order starts at 8:00, next later
                    const startHour = 8 + idx * 4;
                    const durationPx = (order.duration_minutes / 60) * 100; // 100px per hour
                    const leftPx = startHour * 100;

                    return (
                      <div
                        key={order.id}
                        className="absolute top-4 h-12 rounded-xl border border-blue-500/30 bg-linear-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm p-2 flex flex-col justify-center cursor-pointer hover:scale-[1.02] hover:border-blue-400 transition-all shadow-lg group/block"
                        style={{
                          left: `${leftPx}px`,
                          width: `${durationPx}px`,
                        }}
                      >
                        <p className="text-[10px] font-black text-white truncate leading-none">
                          {order.order_number}
                        </p>
                        <p className="text-[9px] font-medium text-blue-300/70 truncate">
                          {order.reference?.article_code}
                        </p>

                        {/* Small mouse tooltip */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover/block:block z-50 bg-slate-800 border border-slate-700 p-2 rounded-lg text-[10px] text-white shadow-2xl w-32">
                          {order.client}
                          <br />
                          <span className="text-blue-400">
                            {Math.round(order.duration_minutes)} min
                          </span>
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

      {/* Footer with Info */}
      <div className="flex items-center gap-2 text-slate-500 bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl">
        <Info size={16} className="text-blue-400" />
        <p className="text-xs">
          Blocks depict production estimated time based on the mold cadency.
        </p>
      </div>
    </div>
  );
};

export default Planning;
