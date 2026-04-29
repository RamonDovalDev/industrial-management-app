import axios from "axios";
import { Activity, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Press {
  id: number;
  name: string;
  state: string;
}

const App: React.FC = () => {
  // Type the state; it's an object list type Press
  const [presses, setPresses] = useState<Press[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Press[]>("http://localhost:8000/presses/")
      .then((response) => {
        setPresses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error connecting to the Backend", error);
        setLoading(false);
      });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-light tracking-widest animate-pulse">
            LOADING VISTA...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600  p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              VISTA <span className="text-blue-500">PLATEX</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest">
              Production Control System
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-xs font-bold text-slate-400 uppercase">
            Server Online
          </span>
        </div>
      </header>

      <main className="max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            State of the Plant
          </h2>
          <span className="text-sm text-slate-500">
            {presses.length} active machines
          </span>
        </div>

        {/* Presses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presses.map((press) => (
            <div
              key={press.id}
              className="roup p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {press.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    press.state === "active"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {press.state}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div
                    className={`w-2 h-2 rounded-full ${press.state === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-amber-500"}`}
                  />
                  {press.state === "active" ? "Producing" : "Technical Stop"}
                </div>
                <button className="text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  DETAILS →
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
