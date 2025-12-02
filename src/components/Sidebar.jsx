import React from 'react';
import { Box, BarChart2, Map, Database, ChevronDown } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden ${active
                ? 'bg-[#005696] text-white shadow-md'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
        >
            <Icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="hidden lg:block text-sm font-medium">{label}</span>
        </button>
    );
};

const Sidebar = ({ activeTab, setActiveTab, selectedRegion, setSelectedRegion, onProfileClick }) => {
    return (
        <aside className="w-16 lg:w-64 flex-shrink-0 bg-[#002e52] text-white flex flex-col transition-all duration-300 shadow-xl z-20">
            <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/10 bg-[#002440]">
                <Box className="w-8 h-8 text-white" />
                <span className="ml-3 font-bold text-lg tracking-wide hidden lg:block text-white">MOTO<span className="text-sky-400">STOCK</span></span>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-1 px-2 lg:px-3">
                <NavItem icon={BarChart2} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavItem icon={Map} label="Geo View" active={activeTab === 'geo'} onClick={() => setActiveTab('geo')} />
                <NavItem icon={Database} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />

                <div className="mt-8 px-2 hidden lg:block">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Filters</h3>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-300 px-2 font-medium">Region</label>
                        <div className="relative">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full bg-[#003d6b] border border-[#004d85] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white appearance-none transition-all hover:bg-[#00467a]"
                            >
                                <option value="All">All Regions</option>
                                <option value="North India">North India</option>
                                <option value="North-East India">North-East India</option>
                                <option value="South India">South India</option>
                                <option value="East India">East India</option>
                                <option value="West India">West India</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#002440]">
                <div
                    onClick={onProfileClick}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all group"
                >
                    <div className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                        RD
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-white">R&D Engineer</p>
                        <p className="text-xs text-slate-400">Admin Access</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
