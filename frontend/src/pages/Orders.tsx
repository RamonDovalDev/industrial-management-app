import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
} from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  client: string;
  quantity: number;
  delivery_date: string;
  planned_start: string | null;
  state: string;
  duration_minutes: number;
  reference?: {
    article_code: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/orders/")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Functrion to determine risk status of the term with respect to today
  const getRiskLevel = (dateStr: string) => {
    const today = new Date();
    const delivery = new Date(dateStr);
    const diffDays = Math.ceil(
      (delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 3)
      return {
        level: "Critical",
        color: "text-red-500",
        icon: <AlertCircle size={16} className="text-red-500" />,
      };
    if (diffDays < 7)
      return {
        level: "Attention",
        color: "text-amber-500",
        icon: <Clock size={16} className="text-amber-500" />,
      };

    return {
      level: "On time",
      color: "text-emerald-500",
      icon: <CheckCircle2 size={16} className="text-emerald-500" />,
    };
  };

  // Reactive filtering on the frontend
  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.reference?.article_code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    // Main container with max-w so that it doesn't stretch too much on ultrawide screens.
    <div className="p-8 max-w-400 mx-auto h-full flex flex-col">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-gray-100 tracking-tight">
            Orders Management
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Real-time tracking and deadline indicators
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* sEARCHING Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Buscar pedido, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64 shadow-inner placeholder-gray-600"
            />
          </div>
          {/* Advanced Filters Button (Simulated) */}
          <button className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-400 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* Table Header (Sticky so that it is always visible) */}
            <thead className="bg-gray-950/80 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  Order
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  Reference
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  Client
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 text-right">
                  Quant.
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  Delivery
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  Risk / Term
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 text-center">
                  State
                </th>
                <th className="px-6 py-4 border-b border-gray-800"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                      Loading orders...
                    </p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No orders were found matching the search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const risk = getRiskLevel(order.delivery_date);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-200">
                          {order.order_number}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-blue-400/90 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                          {order.reference?.article_code || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-300">
                          {order.client}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-bold text-gray-200">
                          {order.quantity.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-400">
                          {new Date(order.delivery_date).toLocaleDateString(
                            "es-ES",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded w-max border border-gray-800">
                          {risk.icon}
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${risk.color}`}
                          >
                            {risk.level}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-gray-400 border border-gray-700 shadow-inner">
                          {order.state}
                        </span>
                      </td>

                      {/* Actions Button, just visible when hover on the row */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-500 hover:text-gray-200 hover:bg-gray-800 rounded p-1.5 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER (Simulated Pagination) --- */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between shrink-0">
          <span className="text-xs font-medium text-gray-500">
            Showing{" "}
            <strong className="text-gray-300">{filteredOrders.length}</strong>{" "}
            orders
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-gray-900 border border-gray-800 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors">
              Former
            </button>
            <button className="px-3 py-1.5 text-xs font-bold text-gray-400 bg-gray-900 border border-gray-800 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
