import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, BrainCircuit } from 'lucide-react';
import { N8N_WEBHOOK_URL } from '../constants';


const AIInsights = ({ onRestock }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

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
                // Handle both direct array or nested object format
                setInsights(data.output || data);
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

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-6 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-indigo-600" />
                    AI Stock Insights
                </h3>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className={`p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition-all ${loading ? 'animate-spin' : ''}`}
                    title="Refresh AI Analysis"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {loading && !insights ? (
                    <div className="text-center py-8 text-slate-500 animate-pulse">
                        <Sparkles className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                        <p>Analyzing inventory patterns...</p>
                    </div>
                ) : !insights ? (
                    <div className="text-center py-8 text-slate-400">
                        <p>Click refresh to generate AI insights</p>
                    </div>
                ) : (
                    <>
                        {/* Alerts Section */}
                        {insights.alerts && insights.alerts.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Critical Attention Needed
                                </h4>
                                <div className="grid gap-3">
                                    {insights.alerts.map((alert, i) => (
                                        <div key={i} className="bg-red-50 border border-red-100 rounded-md p-3 flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                            <p className="text-sm text-slate-700">{alert.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Predictions Section */}
                        {insights.predictions && insights.predictions.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Smart Predictions
                                </h4>
                                <div className="grid gap-3">
                                    {insights.predictions.map((pred, i) => (
                                        <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-md p-3 flex items-start gap-3">
                                            <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-slate-700">{pred.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {lastUpdated && (
                            <div className="text-xs text-slate-400 text-right pt-2">
                                Last analyzed: {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AIInsights;
