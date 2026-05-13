import axios from "axios";
import { Clock, Package, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Order {
  id: number;
  order_number: string;
  client: string;
  quantity: number;
  delivery_date: string;
  duration_minutes: number;
  reference?: {
    article_code: string;
  };
}

const UnplannedSidebar: React.FC = () => {
  const [unplanned, setUnplanned] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/orders/unplanned/")
      .then((res) => {
        setUnplanned(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Función para determinar colores e iconos según la urgencia (días restantes)
  const getUrgencyStyles = (dateStr: string) => {
    const today = new Date();
    const delivery = new Date(dateStr);
    const diffDays = Math.ceil(
      (delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 3)
      return {
        wrapper: "border-red-500/30 bg-red-950/20 hover:border-red-500/50",
        text: "text-red-400",
        icon: <AlertCircle size={14} className="text-red-500" />,
      };
    if (diffDays < 7)
      return {
        wrapper:
          "border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50",
        text: "text-amber-400",
        icon: <Clock size={14} className="text-amber-500" />,
      };
    return {
      wrapper:
        "border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/80",
      text: "text-gray-400",
      icon: <Clock size={14} className="text-gray-500" />,
    };
  };

  return (
    // Usa w-full porque el ancho (w-80) ya lo define Planning.tsx
    <div className="flex flex-col h-full w-full bg-gray-950">
      {/* --- CABECERA DEL BACKLOG --- */}
      <div className="p-5 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-black text-gray-100 tracking-widest uppercase">
            Backlog
          </h3>
          {/* Badge contador de órdenes */}
          <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[10px] font-bold rounded">
            {unplanned.length} ÓRDENES
          </span>
        </div>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
          Pendientes de asignación
        </p>
      </div>

      {/* --- LISTA DE ÓRDENES (SCROLLABLE) --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center mt-10">
            {/* Spinner técnico en vez del clásico texto "Loading..." */}
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : unplanned.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
            <Package size={32} className="opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Backlog Vacío
            </span>
          </div>
        ) : (
          unplanned.map((order) => {
            const urgency = getUrgencyStyles(order.delivery_date);

            return (
              <div
                key={order.id}
                className={`p-3.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing shadow-md group ${urgency.wrapper}`}
              >
                {/* ID de la orden e Icono de Urgencia */}
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[11px] font-black uppercase text-gray-200">
                    {order.order_number}
                  </span>
                  {urgency.icon}
                </div>

                {/* Cliente */}
                <p className="text-xs font-bold text-gray-400 truncate mb-3">
                  {order.client}
                </p>

                {/* Referencia Técnica */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-gray-950 border border-gray-800 flex items-center justify-center">
                    <Package size={12} className="text-blue-500" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-300">
                    Ref: {order.reference?.article_code || "N/A"}
                  </span>
                </div>

                {/* Métricas (Cantidades y Tiempos) */}
                <div className="pt-2.5 border-t border-gray-800/50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">
                      Unidades
                    </span>
                    <span className="text-[10px] font-bold text-gray-300">
                      {order.quantity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">
                      Duración
                    </span>
                    <span className="text-[10px] font-bold text-blue-400">
                      {Math.round(order.duration_minutes)}m
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UnplannedSidebar;
