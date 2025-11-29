import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const InventoryTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs tracking-wider sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">City</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Accessory Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Stock Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {currentItems.map((row, i) => (
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
                            </tr>
                        ))}
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
                        Page {currentPage} of {totalPages}
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
                        disabled={currentPage === totalPages}
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
