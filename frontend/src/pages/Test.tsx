import React, { useState } from "react";
import {
  Settings2,
  Database,
  ShieldAlert,
  Upload,
  Download,
  Server,
  CheckCircle2,
} from "lucide-react";

const Test: React.FC = () => {
  // Simularemos estados locales para los parámetros técnicos
  const [safetyMargin, setSafetyMargin] = useState(48); // horas
  const [maxPressLoad, setMaxPressLoad] = useState(85); // porcentaje

  return (
    <div className="p-8 max-w-[1200px] mx-auto h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      {/* --- CABECERA --- */}
      <div className="flex-shrink-0">
        <h2 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
          <Settings2 className="text-blue-500" size={32} />
          Configuración del Sistema
        </h2>
        <p className="text-gray-500 font-medium mt-1">
          Parámetros globales, integración de datos y estado del servidor
        </p>
      </div>

      {/* --- GRID DE PANELES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* COLUMNA IZQUIERDA: Algoritmos y Servidor */}
        <div className="flex flex-col gap-8">
          {/* Panel 1: Parámetros del Algoritmo (Sliders técnicos) */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <ShieldAlert className="text-amber-500" size={20} />
              Tolerancias de Planificación
            </h3>

            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <span>Plazo Crítico de Seguridad</span>
                  <span className="text-blue-400">{safetyMargin} horas</span>
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="12"
                  value={safetyMargin}
                  onChange={(e) => setSafetyMargin(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  Los pedidos con fecha de entrega inferior a este margen
                  dispararán una alerta roja prioritaria.
                </p>
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <span>Carga Máxima por Prensa</span>
                  <span className="text-emerald-400">{maxPressLoad}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={maxPressLoad}
                  onChange={(e) => setMaxPressLoad(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  El planificador automático intentará no asignar carga por
                  encima de este umbral de desgaste.
                </p>
              </div>

              <div className="pt-2 border-t border-gray-800/50">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-bold rounded border border-gray-700 transition-colors shadow-inner">
                  Guardar Parámetros
                </button>
              </div>
            </div>
          </div>

          {/* Panel 2: Estado del Servidor Backend */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <Server className="text-blue-500" size={20} />
              Conexión Backend FastAPI
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    URL Base de la API
                  </span>
                  <span className="text-sm font-mono text-gray-300 mt-0.5">
                    http://localhost:8000
                  </span>
                </div>
                {/* Etiqueta simulando un Ping correcto */}
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={14} /> Operativo
                </div>
              </div>

              <div className="flex justify-end">
                <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  Ejecutar Ping de Diagnóstico →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Módulo de Importación y Datos */}
        <div className="flex flex-col gap-8">
          {/* Panel 3: Integración de Datos (MBC y Excel) */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <Database className="text-purple-500" size={20} />
              Integración de Datos (MBC & Excel)
            </h3>

            <div className="flex-1 flex flex-col justify-center gap-6">
              {/* Bloque: IMPORTAR */}
              <div className="border border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-gray-800/30 transition-all cursor-pointer group">
                <div className="p-4 bg-gray-950 rounded-full border border-gray-800 mb-4 group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-colors shadow-inner">
                  <Upload
                    size={32}
                    className="text-gray-400 group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <h4 className="text-sm font-bold text-gray-200 mb-1">
                  Importar Base de Datos MBC
                </h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Sincroniza pedidos y referencias manualmente subiendo un
                  volcado Excel de los sistemas legacy de Platex.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs rounded hover:bg-blue-600 hover:text-white transition-colors">
                  Seleccionar Archivo .xlsx
                </button>
              </div>

              {/* Bloque: EXPORTAR */}
              <div className="border border-gray-800 bg-gray-950 rounded-xl p-6 flex items-center justify-between hover:border-emerald-500/50 transition-colors cursor-pointer group shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-900 rounded border border-gray-800 group-hover:bg-emerald-900/20 group-hover:border-emerald-500/30 transition-colors">
                    <Download
                      size={24}
                      className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-sm font-bold text-gray-200">
                      Exportar Planning Optimizado
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                      Formato Reporte (Excel)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
