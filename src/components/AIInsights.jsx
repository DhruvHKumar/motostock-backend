import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, BrainCircuit, Maximize2, X, Info } from 'lucide-react';
import { N8N_WEBHOOK_URL } from '../constants';

const AIInsights = ({ onRestock }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [showAllAlerts, setShowAllAlerts] = useState(false);
    const [showAllPredictions, setShowAllPredictions] = useState(false);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'analyze' })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI Insights Raw Data:', data);

                // Parse the array response format: [{ recommendations: { alerts, predictions, summary } }]
                if (Array.isArray(data) && data.length > 0 && data[0].recommendations) {
                    console.log('Parsing array format');
                    setInsights(data[0].recommendations);
                } else if (data && data.recommendations) {
                    console.log('Using direct recommendations format');
                    setInsights(data.recommendations);
                } else {
                    console.log('Using direct format');
                    setInsights(data);
                }
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchInsights();
    }, []);

    const getVisibleAlerts = () => {
        if (!insights?.alerts) return [];
        return showAllAlerts ? insights.alerts : insights.alerts.slice(0, 2);
    };

    const getVisiblePredictions = () => {
        if (!insights?.predictions) return [];
        const highPriority = insights.predictions.filter(p => p.priority === 'high');
        const others = insights.predictions.filter(p => p.priority !== 'high');
        const all = [...highPriority, ...others];
        return showAllPredictions ? all : all.slice(0, 2);
    };

    const AlertBadge = ({ type }) => {
        const colors = {
            critical: 'bg-red-100 text-red-700 border-red-200',
            warning: 'bg-amber-100 text-amber-700 border-amber-200',
            info: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[type] || colors.info} capitalize`}>
                {type}
            </span>
        );
    };

    // ... (PriorityBadge remains the same)

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-4 border-b border-indigo-100 flex justify-between items-center bg-white/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-md">
                        <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">AI Inventory Insights</h3>
                        {lastUpdated && (
                            <p className="text-[10px] text-slate-400">
                                Updated {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className={`p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all ${loading ? 'animate-spin' : ''}`}
                    title="Refresh Analysis"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {loading && !insights ? (
                    <div className="text-center py-6 text-slate-500 animate-pulse">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                        <p className="text-xs">Analyzing inventory patterns...</p>
                    </div>
                ) : !insights ? (
                    <div className="text-center py-6 text-slate-400">
                        <p className="text-xs">Click refresh to generate AI insights</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats Row */}
                        {insights.summary && (
                            <div className="flex gap-3">
                                <div className="flex-1 p-2 bg-white rounded border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Critical Alerts</span>
                                    <span className="text-sm font-bold text-red-600">{insights.summary.critical_alerts}</span>
                                </div>
                                <div className="flex-1 p-2 bg-white rounded border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Low Stock</span>
                                    <span className="text-sm font-bold text-amber-600">{insights.summary.low_stock_items}</span>
                                </div>
                            </div>
                        )}

                        {/* Alerts Section */}
                        {insights.alerts && insights.alerts.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Alerts
                                    </h4>
                                    {insights.alerts.length > 2 && (
                                        <button
                                            onClick={() => setShowAllAlerts(!showAllAlerts)}
                                            className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            {showAllAlerts ? 'Show Less' : `Show All (${insights.alerts.length})`}
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {getVisibleAlerts().map((alert, i) => (
                                        <div key={i} className={`border rounded p-2.5 flex flex-col gap-1.5 ${alert.type === 'critical' ? 'bg-red-50/50 border-red-100' :
                                                alert.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                                                    'bg-blue-50/50 border-blue-100'
                                            }`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs text-slate-700 font-medium leading-snug">{alert.message}</p>
                                                {alert.type && <AlertBadge type={alert.type} />}
                                            </div>

                                            {(alert.city || alert.stock !== undefined) && (
                                                <div className="flex gap-3 text-[10px] text-slate-500">
                                                    {alert.city && <span>📍 {alert.city}</span>}
                                                    {alert.stock !== undefined && <span>📦 {alert.stock} units</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Predictions Section */}
                        {insights.predictions && insights.predictions.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-indigo-50">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        Predictions
                                    </h4>
                                    {insights.predictions.length > 2 && (
                                        <button
                                            onClick={() => setShowAllPredictions(!showAllPredictions)}
                                            className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            {showAllPredictions ? 'Show Less' : `Show All (${insights.predictions.length})`}
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {getVisiblePredictions().map((pred, i) => (
                                        <div key={i} className="bg-indigo-50/50 border border-indigo-100 rounded p-2.5 flex items-start gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-slate-700 leading-snug">{pred.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AIInsights;
