import {
  AlertTriangle,
  BarChart,
  FlaskConical,
  Play,
  Save,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface SimulationResult {
  estimatedDuration: number;
  assignatedPress: string;
  alertsGenerated: number;
  deliveryRisk: "low" | "medium" | "high";
}

const Simulator: React.FC = () => {
  const [formData, setFormData] = useState({
    reference: "",
    client: "",
    quantity: "",
    targetDate: "",
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Simulate backend sending and algorithm delay
  const handleSimulate = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.reference || !formData.quantity) return;

    setIsSimulating(true);

    // Artificial delay to simulate FastAPI calculation
    setTimeout(() => {
      setResult({
        estimatedDuration: Math.floor(Math.random() * 200) + 60, // 1 to 4 hours
        assignatedPress: "Press " + (Math.floor(Math.random() * 5) + 1),
        alertsGenerated: Math.floor(Math.random() * 3), // 0 to 2 alerts
        deliveryRisk:
          Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
      });

      setIsSimulating(false);
    }, 1500);
  };

  // Support to paint risk block
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-400 bg-red-950/40 border-red-500/580";
      case "medium":
        return "text-amber-400 bg-amber-950/40 border-amber-500/580";
      default:
        return "text-emerald-400 bg-emerald-950/40 border-emerald-500/580";
    }
  };

  return (
    <div className="p-8 max-w-400 mx-auto h-full flex flex-col gap-6">
      {/* --- TOP HEADER --- */}
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
            <FlaskConical size={32} className="text-blue-500" />
            Production Simulation
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Evaluate new orders impact without affecting original planning
          </p>
        </div>
      </div>

      {/* --- DIVIDED CONTAINER (Form / Results) --- */}
      <div className="flex flex-col lg:flex-row flex-1 gap-8 min-h-0">
        {/* Left Panel: Form */}
        <div className="w-full lg:w-100 flex flex-col shrink-0 gap-6 overflow-y-auto custom-scrollbar">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Orders Parameters
            </h3>

            <form onSubmit={handleSimulate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  placeholder="REF-1002"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors shadow-inner placeholder-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Client
                </label>
                <input
                  type="text"
                  placeholder="Client Name"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors shadow-inner placeholder-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Units"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors shadow-inner placeholder-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) =>
                      setFormData({ ...formData, targetDate: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner placeholder-gray-700"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 mt-2 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSimulating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      Run Simulation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel: Results and Preview */}
        <div className="flex-1 bg-[#0d0d14] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
          {/* State 1: Initial (Watiting for input) */}
          {!result && !isSimulating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 text-center p-8">
              <FlaskConical size={64} className="opacity-20 mb-4" />
              <h3 className="text-lg font-bold text-gray-500">
                Projection Panel
              </h3>
              <p className="text-sm mt-2 max-w-md">
                Introduce order parameters and run simulation to evaluate
                viability before affecting production
              </p>
            </div>
          )}

          {/* State 2: Loading (Calculating algotithm) */}
          {isSimulating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm z-10">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-blue-400 font-bold tracking-widest uppercase text-sm animate-pulse">
                Calculating impact...
              </p>
            </div>
          )}
        </div>

        {/* State 3: Results */}
        {result && !isSimulating && (
          <div className="flex flex-col h-full animate-in fade-in zomm-in-95 duration-500">
            {/* Metrics Block */}
            <div className="p-6 border-b border-gray-800 bg-gray-900/80">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Estimated Impact
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg shadow-inner">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Required time
                  </p>
                  <p className="text-xl font-black text-gray-200 mt-1">
                    {result.estimatedDuration} min.
                  </p>
                </div>

                <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg shadow-inner">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                    Optimal Machine:
                  </p>
                  <p className="text-xl font-black text-gray-200 mt-1">
                    {result.assignatedPress}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg shadow-inner ${getRiskColor(result.deliveryRisk)}`}
                >
                  <p className="text-[10px] font-bold uppercase opacity-80">
                    Delay Risk
                  </p>
                  <p className="text-xl font-black mt-1 uppercase">
                    {result.deliveryRisk}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg border shadow-inner ${result.alertsGenerated > 0 ? "bg-red-950/20 border-red-500/50 text-red-400" : "bg-gray-950 border-gray-800 text-gray-400"}`}
                >
                  <p className="text-[10px] font-bold uppercase opacity-80">
                    Collateral Alerts
                  </p>
                  <p className="text-xl font-black mt-1 flex items-center gap-2">
                    {result.alertsGenerated} moved
                    {result.alertsGenerated > 0 && <AlertTriangle size={18} />}
                  </p>
                </div>
              </div>
            </div>

            {/* Modified Gantt Preview */}
            <div className="relative p-6 flex flex-1 flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <BarChart size={16} /> Gantt Preview
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-blue-500/30 border border-blue-500 rounded-sm" />
                    Current Load
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500/30 border border-emerald-500 rounded-sm" />
                    Simulation
                  </span>
                </div>
              </div>

              {/* Gap found visual Mockup */}
              <div className="flex-1 border border-gray-800 bg-gray-950 rounded-lg relative overflow-hidden flex flex-col justify-center px-8 shadow-inner">
                {/* Recommended Press Line */}
                <div className="h-14 border-b border-gray-800/50 flex items-center relative">
                  <div className="w-24 text-xs font-bold text-gray-500 uppercase">
                    {result.assignatedPress}
                  </div>

                  {/* Simulated existing Order */}
                  <div className="absolute left-32 w-48 h-8 bg-blue-600/20 border border-blue-500/20 rounded flex items-center px-2">
                    <span className="text-[10px] font-bold text-blue-300">
                      ORD-EXISTING
                    </span>
                  </div>

                  {/* New simulated order fitting into a gap */}
                  <div className="absolute left-80 w-40 h-8 bg-emerald-500/20 border border-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                      NEW GAP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="p-4 bg-gray-950 border-t border-gray-800 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 font-bold text-sm transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Dismiss
              </button>
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-2">
                <Save size={16} />
                Confirm Integration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
