import {
  CheckCircle2,
  Database,
  Download,
  Server,
  Settings2,
  ShieldAlert,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

const Settings: React.FC = () => {
  const [safetyMargin, setSafetyMargin] = useState(48); // Hours
  const [maxPressLoad, setMaxPressLoad] = useState(85); // Percentage

  return (
    <div className="p-8 max-w-300 mx-auto h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      {/* ---. HEADER --- */}
      <div className="shrink-0">
        <h2 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
          <Settings2 size={32} className="text-blue-500" />
          System Configuration
        </h2>
        <p className="text-gray-500 font-medium mt-1">
          Global parameters, data integration and server state
        </p>
      </div>

      {/* --- PANELS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left Column: Algorithm and Server */}
        <div className="flex flex-col gap-8">
          {/* Panel 1: Algorithm Parameters (Technical Sliders) */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <ShieldAlert size={20} className="text-amber-500" />
              Planning Tolerances
            </h3>

            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase ttracking-wider mb-2">
                  <span>Critical Security Timeframe</span>
                  <span className="text-blue-400">{safetyMargin} hours</span>
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
                  Orders with a delivery date below this margin will trigger a
                  high-priority red alert
                </p>
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase ttracking-wider mb-2">
                  <span>Maximum Load for Press</span>
                  <span className="text-blue-400">{maxPressLoad}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={maxPressLoad}
                  onChange={(e) => setMaxPressLoad(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  The automatic planer will try not to assign load above wear
                  and tear threshold
                </p>
              </div>

              <div className="pt-2 border-t border-gray-800/50">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-bold rounded border border-gray-700 transition-colors shadow-inner">
                  Save Parameters
                </button>
              </div>
            </div>
          </div>

          {/* Panel 2: Backend Server State */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <Server size={20} className="text-blue-500" />
              FastAPI Backend Connection
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    API Base URL
                  </span>
                  <span className="text-sm font-mono text-gray-300 mt-0.5">
                    http://localhost:8000
                  </span>
                </div>
                {/* Label simulating a right Ping */}
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-[10px] font-bold upeercase tracking-wider">
                  <CheckCircle2 size={14} />
                  Operative
                </div>
              </div>

              <div className="flex justify-end">
                <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  Run Diagnostic Ping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Import and Data Module */}
        <div className="flex flex-col gap-8">
          {/* Panel 3: Data Integration (MBC and Excel) */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-xl h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-gray-800 pb-4 mb-6">
              <Database size={20} className="text-purple-500" />
              Data Integration (MBC and Excel)
            </h3>

            <div className="flex flex-1 flex-col justify-center-center gap-6">
              {/* Block: Import */}
              <div className="border border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-gray-800/30 transition-all cursor-pointer group">
                <div className="p-4 bg-gray-950 rounded-full border border-gray-800 mb-4 group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-colors shadow-inner">
                  <Upload
                    size={32}
                    className="text-gray-400 group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <h4 className="text-sm font-bold text-gray-200 mb-1">
                  Import MBC Database
                </h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  Sync manually orders and references uploading and Excel dump
                  from App legacy systems.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs rounded hover:bg-blue-600 hover:text-white transition-colors">
                  Select file .xlsx
                </button>
              </div>

              {/* Block: Export */}
              <div className="border border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-gray-800/30 transition-all cursor-pointer group">
                <div className="p-4 bg-gray-950 rounded-full border border-gray-800 mb-4 group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-colors shadow-inner">
                  <Download
                    size={32}
                    className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-sm font-bold text-gray-200">
                    Export Optimized Planning
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                    Format Report (Excel)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
