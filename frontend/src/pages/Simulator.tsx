import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Zap,
  Play,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Box,
} from "lucide-react";

interface Reference {
  id: number;
  article_code: string;
  description: string;
}

const Simulator: React.FC = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<null | "success" | "warning">(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    refId: "",
    quantity: "",
    client: "",
    deliveryDate: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8000/references/").then((res) => {
      setReferences(res.data);
      setLoading(false);
    });
  }, []);

  const runSimulation = () => {
    setIsSimulating(true);
    setResult(null);

    // Simulamos un retraso de procesamiento para dar realismo
    setTimeout(() => {
      setIsSimulating(false);
      // Lógica de simulación simple para el prototipo:
      // Si la cantidad es > 5000, mostramos advertencia de retraso
      setResult(Number(formData.quantity) > 5000 ? "warning" : "success");
    }, 1500);
  };

  if (loading)
    return (
      <div className="p-8 text-purple-500 animate-pulse font-bold">
        Iniciando motor de simulación...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-900/30">
          <Zap className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Orders Simulator
          </h2>
          <p className="text-slate-500 font-medium">
            Evaluet the impact of orders before confirmar them
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entry Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PlusCircle className="text-purple-500" />
            Hypothetical New Order
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Product Reference
              </label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={formData.refId}
                onChange={(e) =>
                  setFormData({ ...formData, refId: e.target.value })
                }
              >
                <option value="">Select a reference...</option>
                {references.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.article_code} - {ref.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Ej: 2000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Client
              </label>
              <input
                type="text"
                placeholder="Nombre del cliente..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={!formData.refId || !formData.quantity || isSimulating}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  PROCESSING...
                </>
              ) : (
                <>
                  <Play size={20} />
                  RUN SIMULACIÓN
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center items-center text-center">
          {!result && !isSimulating && (
            <div className="space-y-4">
              <div className="bg-slate-800 p-6 rounded-full inline-block">
                <Zap size={48} className="text-slate-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-400">
                Waiting parameters
              </h4>
              <p className="text-slate-600 max-w-xs">
                Configurate the order on the left to see the impact in the
                planniung.
              </p>
            </div>
          )}

          {isSimulating && (
            <div className="space-y-4">
              <div className="text-purple-500 animate-bounce">
                <Box size={64} />
              </div>
              <h4 className="text-xl font-bold text-white">
                Recalculating Planning...
              </h4>
              <p className="text-slate-500">
                Searching free spaces on presses Engel y Arburg.
              </p>
            </div>
          )}

          {result === "success" && (
            <div className="space-y-6 animate-in zoom-in-90 duration-300">
              <div className="bg-emerald-500/10 p-6 rounded-full inline-block border border-emerald-500/20">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h4 className="text-2xl font-black text-white">Viable Order!</h4>
              <p className="text-slate-400">
                There's enough capability to fulfill this order without delay in
                current orders
              </p>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-left">
                <p className="text-xs text-emerald-400 font-bold uppercase mb-1">
                  Estimated Impact
                </p>
                <p className="text-sm text-emerald-200">
                  Planning Delay: 0 hours
                </p>
                <p className="text-sm text-emerald-200">Press Use: 65%</p>
              </div>
            </div>
          )}

          {result === "warning" && (
            <div className="space-y-6 animate-in zoom-in-90 duration-300">
              <div className="bg-orange-500/10 p-6 rounded-full inline-block border border-orange-500/20">
                <AlertCircle size={48} className="text-orange-500" />
              </div>
              <h4 className="text-2xl font-black text-white">
                Detected Conflict
              </h4>
              <p className="text-slate-400">
                These order will cause delays in other orders due to lack of
                available hours
              </p>
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl text-left">
                <p className="text-xs text-orange-400 font-bold uppercase mb-1">
                  Alerts
                </p>
                <p className="text-sm text-orange-200">
                  Delay in ORD-1002: +14 hours
                </p>
                <p className="text-sm text-orange-200">
                  Change required of extra mold.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
