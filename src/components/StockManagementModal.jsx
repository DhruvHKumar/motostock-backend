import React, { useState, useMemo } from 'react';
import { X, Truck, ArrowRight, Package, AlertTriangle, Check } from 'lucide-react';

const StockManagementModal = ({ isOpen, onClose, item, allData, onRestock, onShiftStock }) => {
    const [activeTab, setActiveTab] = useState('restock'); // 'restock' or 'shift'
    const [shiftAmount, setShiftAmount] = useState('');
    const [targetCity, setTargetCity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find other cities in the same region that have the same item
    const regionalCities = useMemo(() => {
        if (!item || !item.region) return [];
        return allData.filter(d =>
            d.region === item.region &&
            d.city !== item.city &&
            d.item === item.item
        );
    }, [allData, item]);

    // Early return AFTER all hooks
    if (!isOpen || !item) return null;

    const handleRestock = () => {
        setIsSubmitting(true);
        // Reuse the existing restock logic (simulated AI)
        onRestock(item.city, item.category, item.item);

        // Close modal after a short delay to allow the toast to appear
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    const handleShift = () => {
        if (!targetCity || !shiftAmount || parseInt(shiftAmount) <= 0) return;

        setIsSubmitting(true);
        onShiftStock(item.city, targetCity, item.item, parseInt(shiftAmount));

        setTimeout(() => {
            setIsSubmitting(false);
            setShiftAmount('');
            setTargetCity('');
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800">Manage Stock</h3>
                        <p className="text-xs text-slate-500">{item.item} • {item.city}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Current Status */}
                <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">Current Stock Level</span>
                    <span className={`text-lg font-bold font-mono ${item.stock < 30 ? 'text-red-600' : 'text-[#005696]'}`}>
                        {item.stock} units
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'restock' ? 'text-[#005696] border-b-2 border-[#005696] bg-blue-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('restock')}
                    >
                        Get New Stock
                    </button>
                    <button
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'shift' ? 'text-[#005696] border-b-2 border-[#005696] bg-blue-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('shift')}
                    >
                        Shift Excess Stock
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'restock' ? (
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <Package className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900">AI Procurement Agent</h4>
                                        <p className="text-xs text-indigo-700 mt-1">
                                            Our AI agent will analyze demand patterns and automatically place an optimal order with the nearest warehouse.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleRestock}
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-[#005696] hover:bg-[#00467a] text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Processing...' : 'Request New Stock'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500 mb-2">
                                Move stock to other cities in <span className="font-bold">{item.region}</span> to balance inventory.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Target City</label>
                                    <select
                                        value={targetCity}
                                        onChange={(e) => setTargetCity(e.target.value)}
                                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] outline-none"
                                    >
                                        <option value="">Select a city...</option>
                                        {regionalCities.map(city => (
                                            <option key={city.city} value={city.city}>
                                                {city.city} (Current: {city.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Amount to Transfer</label>
                                    <input
                                        type="number"
                                        value={shiftAmount}
                                        onChange={(e) => setShiftAmount(e.target.value)}
                                        max={item.stock}
                                        min="1"
                                        placeholder="Enter quantity"
                                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] outline-none"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">Max available: {item.stock}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleShift}
                                disabled={isSubmitting || !targetCity || !shiftAmount || parseInt(shiftAmount) > item.stock}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Transferring...' : 'Confirm Transfer'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockManagementModal;
