import React, { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, ChevronLeft, ChevronRight, Filter, RotateCcw, Settings } from 'lucide-react';
import { CATEGORIES } from '../constants';
import StockManagementModal from './StockManagementModal';

const InventoryTable = ({ data, allData, onRestock, onShiftStock }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItem, setSelectedItem] = useState(null);

    // Filter States
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [demandFilter, setDemandFilter] = useState('All');

    // Filter Logic
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
            const demandMatch = demandFilter === 'All' || item.demand === demandFilter;

            let stockMatch = true;
            if (stockFilter === 'Low Stock') stockMatch = item.stock < 30;
            else if (stockFilter === 'Optimal') stockMatch = item.stock >= 30 && item.stock <= 150;
            else if (stockFilter === 'Surplus') stockMatch = item.stock > 150;

            return categoryMatch && demandMatch && stockMatch;
        });
    }, [data, categoryFilter, stockFilter, demandFilter]);

    // Reset Filters
    const resetFilters = () => {
        setCategoryFilter('All');
        setStockFilter('All');
        setDemandFilter('All');
        setCurrentPage(1);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleCategoryChange = (e) => { setCategoryFilter(e.target.value); setCurrentPage(1); };
    const handleStockChange = (e) => { setStockFilter(e.target.value); setCurrentPage(1); };
    const handleDemandChange = (e) => { setDemandFilter(e.target.value); setCurrentPage(1); };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <StockManagementModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                allData={allData}
                onRestock={onRestock}
                onShiftStock={onShiftStock}
            />

            {/* Filter Bar */}
            <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filters:
                </div>

                <select
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-[#005696] focus:border-[#005696] p-2 min-w-[120px]"
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={handleStockChange}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-[#005696] focus:border-[#005696] p-2 min-w-[120px]"
                >
                    <option value="All">All Stock Levels</option>
                    <option value="Low Stock">Low Stock (&lt;30)</option>
                    <option value="Optimal">Optimal (30-150)</option>
                    <option value="Surplus">Surplus (&gt;150)</option>
                </select>

                <select
                    value={demandFilter}
                    onChange={handleDemandChange}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-[#005696] focus:border-[#005696] p-2 min-w-[120px]"
                >
                    <option value="All">All Demand</option>
                    <option value="High">High Demand</option>
                    <option value="Normal">Normal Demand</option>
                </select>

                {(categoryFilter !== 'All' || stockFilter !== 'All' || demandFilter !== 'All') && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium ml-auto px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Filters
                    </button>
                )}

                <div className="ml-auto text-sm text-slate-500">
                    Showing {filteredData.length} items
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs tracking-wider sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">City</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Accessory Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Stock Level</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {currentItems.length > 0 ? (
                            currentItems.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-700">{row.city}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${row.category === 'safety' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                row.category === 'engine' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                                    row.category === 'tech' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                                        'bg-emerald-50 border-emerald-100 text-emerald-700'
                                            }`}>
                                            {row.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-medium">{row.item}</td>
                                    <td className="px-6 py-4">
                                        {row.stock < 30 ? (
                                            <span className="flex items-center gap-2 text-red-600 text-xs font-medium">
                                                <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                                            </span>
                                        ) : row.stock > 150 ? (
                                            <span className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                                                <TrendingUp className="w-3.5 h-3.5" /> Surplus
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 text-xs font-medium">Optimal</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${row.stock < 30 ? 'bg-red-500' : row.stock > 150 ? 'bg-emerald-500' : 'bg-[#005696]'}`}
                                                    style={{ width: `${Math.min(100, (row.stock / 200) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-mono text-slate-600 w-8">{row.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedItem(row)}
                                            className="text-xs font-medium text-[#005696] hover:text-[#00467a] hover:bg-blue-50 px-3 py-1.5 rounded transition-colors border border-transparent hover:border-blue-100"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    No items match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-[#005696] focus:border-[#005696] p-1"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-slate-500">entries</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 mr-2">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryTable;
