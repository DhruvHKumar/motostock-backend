import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendUp, subtext, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        red: "bg-red-50 text-red-600",
        emerald: "bg-emerald-50 text-emerald-600",
        indigo: "bg-indigo-50 text-indigo-600"
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium mt-auto ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend} <span className="text-slate-400 font-normal ml-1">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
