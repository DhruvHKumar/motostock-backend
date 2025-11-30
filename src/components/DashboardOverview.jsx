import React, { useState } from 'react';
import { Package, AlertTriangle, Activity, TrendingUp, BarChart2, X } from 'lucide-react';
import KPICard from './KPICard';
import AIInsights from './AIInsights';
import { CATEGORIES } from '../constants';

const DashboardOverview = ({ data, onRestock }) => {
    const [showAllCritical, setShowAllCritical] = useState(false);

    // Calculate Metrics
    const totalStock = data.reduce((acc, curr) => acc + curr.stock, 0);
    const lowStockCount = data.filter(d => d.stock < 30).length;
    const highDemandCount = data.filter(d => d.demand === 'High').length;

    const stockByCategory = CATEGORIES.map(cat => ({
        ...cat,
        value: data.filter(d => d.category === cat.id).reduce((acc, curr) => acc + curr.stock, 0)
    })).sort((a, b) => b.value - a.value);

    const stockByRegion = Object.entries(data.reduce((acc, curr) => {
        // Filter out undefined/null regions
        if (curr.region) {
            acc[curr.region] = (acc[curr.region] || 0) + curr.stock;
        }
        return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    const criticalItems = data.filter(d => d.stock < 30).sort((a, b) => a.stock - b.stock);
    const topCriticalItems = criticalItems.slice(0, 5);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* View All Critical Alerts Modal */}
            {showAllCritical && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAllCritical(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                All Critical Stock Alerts ({criticalItems.length})
                            </h2>
                            <button onClick={() => setShowAllCritical(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">City</th>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Current Stock</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {criticalItems.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-700">{item.city}</td>
                                            <td className="px-6 py-4 text-slate-700">{item.item}</td>
                                            <td className="px-6 py-4 text-slate-500">{CATEGORIES.find(c => c.id === item.category)?.label}</td>
                                            <td className="px-6 py-4 font-mono text-red-600 font-bold">{item.stock}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    Critical Low
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        onRestock(item.city, item.category, item.item);
                                                        setShowAllCritical(false);
                                                    }}
                                                    className="text-xs font-medium text-white bg-[#005696] px-3 py-1.5 rounded hover:bg-[#00467a] transition-colors"
                                                >
                                                    Restock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Inventory"
                    value={totalStock.toLocaleString()}
                    icon={Package}
                    trend="+12%"
                    trendUp={true}
                    color="blue"
                />
                <KPICard
                    title="Critical Alerts"
                    value={lowStockCount}
                    icon={AlertTriangle}
                    trend="+2"
                    trendUp={false}
                    color="red"
                />
                <KPICard
                    title="High Demand Areas"
                    value={highDemandCount}
                    icon={Activity}
                    trend="Stable"
                    trendUp={true}
                    color="emerald"
                />
                <KPICard
                    title="Top Category"
                    value={stockByCategory[0]?.label || 'N/A'}
                    icon={TrendingUp}
                    subtext={`${stockByCategory[0]?.value} units`}
                    color="indigo"
                />
            </div>

            {/* AI Insights Panel */}
            <AIInsights onRestock={onRestock} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#005696]" />
                        Regional Stock Distribution
                    </h3>
                    <div className="h-64 w-full flex items-end justify-around gap-4 px-4">
                        {stockByRegion.length > 0 ? stockByRegion.map((region, i) => {
                            const maxVal = Math.max(...stockByRegion.map(r => r.value));
                            const height = maxVal > 0 ? (region.value / maxVal) * 100 : 0;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                    <div className="relative w-full max-w-[60px] bg-slate-100 rounded-t-md h-48 flex items-end overflow-hidden">
                                        <div
                                            className="w-full bg-[#005696] rounded-t-md transition-all duration-500 group-hover:bg-[#00467a]"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {region.value} units
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-500 text-center">{region.name.split(' ')[0]}</span>
                                </div>
                            )
                        }) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-400">
                                <p className="text-sm">No regional data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Donut Chart / Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Category Split</h3>
                    <div className="flex-1 flex flex-col justify-center gap-4">
                        {stockByCategory.map((cat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                        {cat.label}
                                    </span>
                                    <span className="text-slate-500">{cat.value}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${totalStock > 0 ? (cat.value / totalStock) * 100 : 0}%`, backgroundColor: cat.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Critical Alerts Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Critical Stock Alerts
                    </h3>
                    <button
                        onClick={() => setShowAllCritical(true)}
                        className="text-sm text-[#005696] font-medium hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-3">City</th>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Current Stock</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topCriticalItems.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-700">{item.city}</td>
                                    <td className="px-6 py-4 text-slate-700">{item.item}</td>
                                    <td className="px-6 py-4 text-slate-500">{CATEGORIES.find(c => c.id === item.category)?.label}</td>
                                    <td className="px-6 py-4 font-mono text-red-600 font-bold">{item.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            Critical Low
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onRestock(item.city, item.category, item.item)}
                                            className="text-xs font-medium text-white bg-[#005696] px-3 py-1.5 rounded hover:bg-[#00467a] transition-colors"
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {topCriticalItems.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No critical alerts at this time.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
