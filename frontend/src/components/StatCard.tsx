import { ArrowUpRight } from "lucide-react";
import React from "react";

const StatCard = ({ title, value, icon, color }: any) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl hover:border-blue-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-2 rounded-xl bg-${color}-500/10 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600" />
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-black text-white mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
