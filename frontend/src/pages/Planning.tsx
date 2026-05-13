import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import UnplannedSidebar from "../components/UnplannedSidebar";

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

// Escala de píxeles para el Gantt (1 hora = 120px)
const PIXELS_PER_HOUR = 120;

const getXPosition = (dateStr: string | null) => {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes();
  return h * PIXELS_PER_HOUR + m * (PIXELS_PER_HOUR / 60);
};

// Generamos las horas del día para la cabecera del Gantt (00:00 a 23:00)
const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

const Planning: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [presses, setPresses] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-pulse text-blue-500 font-bold flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
          Cargando Planificación...
        </div>
      </div>
    );
  }

  return (
    // Contenedor principal: Ocupa todo el espacio que Layout le da.
    <div className="flex flex-row h-full w-full overflow-hidden text-gray-100">
      {/* --- COLUMNA IZQUIERDA: BACKLOG --- */}
      {/* w-80 (320px) fijos para las órdenes no planificadas */}
      <div className="w-80 flex-shrink-0 border-r border-gray-800 bg-gray-950 flex flex-col h-full z-10 shadow-2xl relative">
        <UnplannedSidebar />
      </div>

      {/* --- COLUMNA DERECHA: GANTT --- */}
      {/* flex-1 (toma el resto del espacio) y min-w-0 (necesario para que flexbox corte textos largos) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d14] relative">
        {/* Cabecera del Gantt */}
        <div className="h-20 border-b border-gray-800 bg-gray-900/90 px-6 flex items-center justify-between flex-shrink-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              Gantt por Prensa
            </h2>
            {/* Leyenda de Colores */}
            <div className="flex items-center gap-4 mt-1.5 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-gray-400">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-600/50 border border-blue-500"></div>{" "}
                Producción
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <div className="w-2.5 h-2.5 rounded-sm bg-purple-600/50 border border-purple-500"></div>{" "}
                Cambio Molde
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500/50 border border-red-500"></div>{" "}
                Crítico
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Controles de Fecha */}
            <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-1 shadow-inner">
              <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="px-4 flex items-center gap-2 border-x border-gray-800">
                <CalendarDays size={16} className="text-blue-500" />
                <span className="text-sm font-semibold text-gray-200">Hoy</span>
              </div>
              <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Filtros extra */}
            <button className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-300 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* --- ÁREA DE SCROLL (EL GANTT REAL) --- */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          {/* Cabecera del eje de tiempo (Sticky Top) */}
          <div className="sticky top-0 z-30 flex border-b border-gray-800 bg-gray-900 shadow-md">
            {/* Columna fija: Título "Maquinaria" (Sticky Left) */}
            <div className="w-56 flex-shrink-0 p-3 border-r border-gray-800 sticky left-0 bg-gray-900 z-40 flex items-center shadow-lg">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Maquinaria
              </span>
            </div>
            {/* Escala de las horas */}
            <div
              className="flex"
              style={{ width: `${24 * PIXELS_PER_HOUR}px` }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-shrink-0 text-center border-r border-gray-800/40 text-[10px] font-bold text-gray-500 py-3"
                  style={{ width: `${PIXELS_PER_HOUR}px` }}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Filas de Producción */}
          {/* Calculamos el ancho total: ancho del timeline + ancho de la columna de máquinas (224px = w-56) */}
          <div
            className="relative"
            style={{ width: `${24 * PIXELS_PER_HOUR + 224}px` }}
          >
            {/* Línea vertical roja: MOMENTO ACTUAL (AHORA) */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20 pointer-events-none"
              style={{
                left: `${224 + getXPosition(new Date().toISOString())}px`,
              }}
            >
              <div className="absolute top-1 -translate-x-1/2 bg-red-500 text-[9px] text-white font-bold px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                NOW
              </div>
            </div>

            {presses.map((press) => {
              const pressOrders = orders.filter(
                (o) => o.press_id === press.id && o.planned_start !== null,
              );

              return (
                <div
                  key={press.id}
                  className="flex border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                >
                  {/* Columna Fija: Nombre de Prensa e info (Sticky Left) */}
                  <div className="w-56 flex-shrink-0 p-4 border-r border-gray-800 sticky left-0 bg-[#0d0d14] group-hover:bg-[#12121a] transition-colors z-10 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-gray-200">
                      {press.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${press.state === "active" ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`}
                      />
                      <span className="text-[10px] text-gray-400 capitalize font-medium">
                        {press.state}
                      </span>
                    </div>
                  </div>

                  {/* Fila en el tiempo para esta prensa */}
                  <div className="relative flex-1 h-20">
                    {/* Renderizamos los Bloques de Producción */}
                    {pressOrders.map((order) => {
                      const leftPx = getXPosition(order.planned_start);
                      const durationPx =
                        (order.duration_minutes / 60) * PIXELS_PER_HOUR;

                      // Simulamos si está crítico para aplicar el color rojo (En V2 vendrá del Backend)
                      const isCritical = false;
                      const bgClass = isCritical
                        ? "bg-red-600/20 border-red-500/50 text-red-100"
                        : "bg-blue-600/20 border-blue-500/50 text-blue-100";

                      return (
                        <div
                          key={order.id}
                          className={`absolute top-2 bottom-2 rounded-md border backdrop-blur-sm p-2 flex flex-col justify-center cursor-pointer hover:brightness-125 transition-all shadow-lg hover:z-30 group/block ${bgClass}`}
                          style={{
                            left: `${leftPx}px`,
                            width: `${durationPx}px`,
                          }}
                        >
                          <span className="text-[11px] font-bold truncate drop-shadow-md">
                            {order.order_number}
                          </span>
                          <span className="text-[9px] opacity-80 truncate font-mono mt-0.5">
                            {order.reference?.article_code || "N/A"}
                          </span>

                          {/* Tooltip emergente superpuesto (Aparece al hacer hover) */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover/block:flex flex-col gap-1 w-48 bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-xs font-bold text-white border-b border-gray-700 pb-1.5">
                              {order.client}
                            </p>
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                              <span>Cant:</span>{" "}
                              <span className="text-white font-medium">
                                {order.quantity} un.
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>Duración:</span>{" "}
                              <span className="text-white font-medium">
                                {Math.round(order.duration_minutes)} m
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
      </div>
    </div>
  );
};

export default Planning;
