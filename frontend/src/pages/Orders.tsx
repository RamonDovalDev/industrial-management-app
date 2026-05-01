import axios from "axios";
import {
  Calendar,
  Filter,
  Hash,
  MoreHorizontal,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Order {
  id: number;
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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading orders: ", error);
        setLoading(false);
      });
  }, []);

  // Function to calculate the deadline
  const getDeadlineStatus = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 0)
      return { label: "Expired", color: "bg-rose-500", text: "text-rose-500" };
    if (days < 3)
      return {
        label: "Critical",
        color: "bg-orange-500",
        text: "text-orange-500",
      };
    if (days < 7)
      return { label: "On time", color: "bg-blue-500", text: "text-blue-500" };

    return { label: "Ample", color: "bg-orange-500", text: "text-orange-500" };
  };

  if (loading)
    return (
      <div className="p-8 text-blue-500 animate-pulse font-bold">
        Loading Orders...
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Orders Management
          </h2>
          <p className="text-slate-500">
            Full list of active orders and delivery state
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar pedido o cliente..."
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>
      {/* Orders Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-x-auto backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Delivery</th>
              <th className="px-6 py-4 text-center">Deadline</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => {
              const status = getDeadlineStatus(order.delivery_date);
              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-blue-500" />
                      <span className="font-bold text-white">
                        {order.order_number}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={14} className="text-slate-500" />
                      {order.client}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1 inline-block">
                      <span className="text-xs font-bold text-blue-400">
                        {order.reference?.article_code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-slate-400">
                      {order.quantity.toLocaleString()} uds
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Calendar size={14} className="text-slate-500" />
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${status.color} shadow-lg animate-pulse`}
                      ></div>
                      <span
                        className={`text-[10px] font-black uppercase ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
