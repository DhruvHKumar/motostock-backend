import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Settings, Map, Box, AlertTriangle, TrendingUp, Database, Shield, Wrench, Zap, Smile, BarChart2, Search, Cpu, ChevronDown, Bell, ArrowUpRight, ArrowDownRight, Package, Activity, X, Check, LogOut, User as UserIcon, Mail, Phone } from 'lucide-react';

/**
 * MOCK DATA GENERATION
 */

const RAW_CITIES = [
    { name: "Chandigarh", region: "North India", lat: 30.7333, lng: 76.7794, climate: "Seasonal", rainfall: "Moderate", specificNeeds: ["Fog Lights", "Riding Jacket (Mesh)", "ABS"] },
    { name: "Agartala", region: "North-East India", lat: 23.8315, lng: 91.2868, climate: "High Rainfall", rainfall: "High", specificNeeds: ["Rain Suit", "Waterproof Seat Cover", "Mud Flaps"] },
    { name: "Aizawl", region: "North-East India", lat: 23.7271, lng: 92.7176, climate: "Hilly/Cold", rainfall: "Moderate", specificNeeds: ["Grip Heaters", "Fog Lights", "Hill Hold Assist"] },
    { name: "Kohima", region: "North-East India", lat: 25.6701, lng: 94.1077, climate: "Cold/Wet", rainfall: "High", specificNeeds: ["Thermal Liners", "All-Terrain Tyres", "Winches"] },
    { name: "Dimapur", region: "North-East India", lat: 25.9060, lng: 93.7272, climate: "Humid", rainfall: "Moderate", specificNeeds: ["Ventilated Helmet", "Cooling Vest", "Dust Cover"] },
    { name: "Manali", region: "North India", lat: 32.2432, lng: 77.1892, climate: "Snow/Cold", rainfall: "Variable", specificNeeds: ["Snow Chains", "Heated Grips", "Adventure Guards"] },
    { name: "Jaipur", region: "North India", lat: 26.9124, lng: 75.7873, climate: "Hot/Dry", rainfall: "Low", specificNeeds: ["Coolant Boost", "Mesh Jacket", "Hydration Pack"] },
    { name: "Mumbai", region: "West India", lat: 19.0760, lng: 72.8777, climate: "Coastal/Humid", rainfall: "Heavy", specificNeeds: ["Anti-Rust Coating", "Rain Gear", "Waterproof Luggage"] }
];

const CATEGORIES = [
    { id: 'safety', label: 'Safety', icon: Shield, color: '#005696' }, // Bajaj Blue
    { id: 'engine', label: 'Engine', icon: Zap, color: '#f59e0b' },   // Amber
    { id: 'maintenance', label: 'Maint.', icon: Wrench, color: '#64748b' }, // Slate
    { id: 'comfort', label: 'Comfort', icon: Smile, color: '#10b981' }, // Emerald
    { id: 'tech', label: 'Tech', icon: Cpu, color: '#6366f1' }     // Indigo
];

// Generate synthetic stock data
const generateStockData = () => {
    const data = [];
    RAW_CITIES.forEach(city => {
        CATEGORIES.forEach(cat => {
            let baseStock = Math.floor(Math.random() * 150) + 20;
            let demand = 'Normal';

            if (city.rainfall === 'High' && (cat.id === 'safety' || cat.id === 'comfort')) {
                baseStock += 100;
                demand = 'High';
            }

            if (Math.random() > 0.8) baseStock = Math.floor(Math.random() * 20);

            data.push({
                city: city.name,
                region: city.region,
                lat: city.lat,
                lng: city.lng,
                category: cat.id,
                stock: baseStock,
                demand: demand,
                topItems: city.specificNeeds ? city.specificNeeds.map(item => ({ name: item, qty: Math.floor(baseStock / 3) })) : []
            });
        });
    });
    return data;
};

const DATASET = generateStockData();

// Custom Marker Icon
const createCustomIcon = (isCritical) => {
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="marker-pin ${isCritical ? 'critical' : ''}"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35]
    });
};

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toast, setToast] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [settings, setSettings] = useState({
        autoRefresh: true,
        refreshInterval: 30,
        notifications: true,
        emailAlerts: false,
        theme: 'light'
    });

    const filteredData = useMemo(() => {
        return DATASET.filter(d => {
            const regionMatch = selectedRegion === 'All' || d.region === selectedRegion;
            const searchMatch = d.city.toLowerCase().includes(searchTerm.toLowerCase());
            return regionMatch && searchMatch;
        });
    }, [selectedRegion, searchTerm]);

    const addNotification = (city, category) => {
        const newNotification = {
            id: Date.now(),
            city,
            category: CATEGORIES.find(c => c.id === category)?.label || category,
            timestamp: new Date(),
            read: false
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast
        setToast({
            message: `Restock request for ${CATEGORIES.find(c => c.id === category)?.label} in ${city} has been submitted`,
            type: 'success'
        });

        // Hide toast after 3 seconds
        setTimeout(() => setToast(null), 3000);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-[#005696] selection:text-white">
            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-slate-800">Auto Refresh</h3>
                                    <p className="text-xs text-slate-500">Automatically update data</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, autoRefresh: !settings.autoRefresh })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoRefresh ? 'bg-[#005696]' : 'bg-slate-300'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoRefresh ? 'translate-x-6' : ''
                                        }`}></div>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Refresh Interval (seconds)
                                </label>
                                <input
                                    type="number"
                                    value={settings.refreshInterval}
                                    onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#005696] focus:border-[#005696] outline-none"
                                    min="10"
                                    max="300"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-slate-800">Push Notifications</h3>
                                    <p className="text-xs text-slate-500">Show notification alerts</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-[#005696]' : 'bg-slate-300'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''
                                        }`}></div>
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-slate-800">Email Alerts</h3>
                                    <p className="text-xs text-slate-500">Send critical alerts via email</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailAlerts ? 'bg-[#005696]' : 'bg-slate-300'
                                        }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailAlerts ? 'translate-x-6' : ''
                                        }`}></div>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    setToast({ message: 'Settings saved successfully', type: 'success' });
                                    setTimeout(() => setToast(null), 3000);
                                }}
                                className="px-4 py-2 bg-[#005696] text-white rounded-md hover:bg-[#00467a] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Profile Modal */}
            {showUserProfile && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUserProfile(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
                            <button onClick={() => setShowUserProfile(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-sky-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg mb-3">
                                    RD
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">R&D Engineer</h3>
                                <p className="text-sm text-slate-500">Admin Access</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-[#005696]" />
                                    <div>
                                        <p className="text-xs text-slate-500">Full Name</p>
                                        <p className="font-medium text-slate-800">Dhruv Kumar</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-[#005696]" />
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="font-medium text-slate-800">dhruv.kumar@motostock.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-[#005696]" />
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="font-medium text-slate-800">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Shield className="w-5 h-5 text-[#005696]" />
                                    <div>
                                        <p className="text-xs text-slate-500">Department</p>
                                        <p className="font-medium text-slate-800">Research & Development</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200">
                            <button
                                onClick={() => {
                                    setShowUserProfile(false);
                                    setToast({ message: 'Logged out successfully', type: 'success' });
                                    setTimeout(() => setToast(null), 3000);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white border border-emerald-200 shadow-lg rounded-lg p-4 flex items-start gap-3 max-w-md">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
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
                        onClick={() => setShowUserProfile(true)}
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                            {activeTab === 'dashboard' ? 'Executive Overview' :
                                activeTab === 'geo' ? 'Geographic Stock Analysis' : 'Inventory Database'}
                        </h1>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 hidden sm:flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live System
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005696] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search cities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] outline-none w-64 transition-all focus:w-80 placeholder:text-slate-500 text-slate-800 hover:bg-slate-50"
                            />
                        </div>

                        {/* Notification Button with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-slate-500 hover:text-[#005696] hover:bg-slate-100 rounded-full transition-all relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500">
                                                <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                                    onClick={() => markAsRead(notif.id)}
                                                >
                                                    <div className="flex justify-between items-start gap-3">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-800">
                                                                Restock Request Submitted
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {notif.category} in {notif.city}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-2">
                                                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                clearNotification(notif.id);
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 text-slate-500 hover:text-[#005696] hover:bg-slate-100 rounded-full transition-all"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 relative overflow-hidden p-6 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                        <DashboardOverview data={filteredData} onRestock={addNotification} />
                    )}
                    {activeTab === 'geo' && (
                        <div className="h-full rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-white">
                            <GeoDashboard data={filteredData} rawCities={RAW_CITIES} />
                        </div>
                    )}
                    {activeTab === 'inventory' && (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">
                            <InventoryTable data={filteredData} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon: Icon, label, active, onClick }) {
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
}

// --- GEO DASHBOARD ---

const GeoDashboard = ({ data, rawCities }) => {
    // Center of India
    const center = [22.5937, 78.9629];

    // Aggregate data by city for the map
    const cityData = useMemo(() => {
        return rawCities.map(city => {
            const cityStock = data.filter(d => d.city === city.name);
            const totalStock = cityStock.reduce((acc, curr) => acc + curr.stock, 0);
            const lowStockItems = cityStock.filter(d => d.stock < 30);
            const isCritical = lowStockItems.length > 0;

            return {
                ...city,
                totalStock,
                isCritical,
                details: cityStock
            };
        });
    }, [data, rawCities]);

    return (
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {cityData.map((city, idx) => (
                <Marker
                    key={idx}
                    position={[city.lat, city.lng]}
                    icon={createCustomIcon(city.isCritical)}
                >
                    <Popup className="custom-popup">
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2 mb-2">{city.name}</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Total Stock</span>
                                <span className="font-bold text-[#005696]">{city.totalStock}</span>
                            </div>

                            {city.isCritical && (
                                <div className="bg-red-50 border border-red-100 rounded p-2 mb-2">
                                    <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Critical Items
                                    </p>
                                    <ul className="mt-1 space-y-1">
                                        {city.details.filter(d => d.stock < 30).map((d, i) => (
                                            <li key={i} className="text-[10px] text-red-500 flex justify-between">
                                                <span>{CATEGORIES.find(c => c.id === d.category)?.label}</span>
                                                <span className="font-mono">{d.stock}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Category Breakdown</p>
                                {city.details.map((d, i) => (
                                    <div key={i} className="flex justify-between text-xs text-slate-600">
                                        <span>{CATEGORIES.find(c => c.id === d.category)?.label}</span>
                                        <span className={`font-medium ${d.stock < 30 ? 'text-red-500' : 'text-slate-700'}`}>{d.stock}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

// --- DASHBOARD OVERVIEW ---

const DashboardOverview = ({ data, onRestock }) => {
    // Calculate Metrics
    const totalStock = data.reduce((acc, curr) => acc + curr.stock, 0);
    const lowStockCount = data.filter(d => d.stock < 30).length;
    const highDemandCount = data.filter(d => d.demand === 'High').length;

    const stockByCategory = CATEGORIES.map(cat => ({
        ...cat,
        value: data.filter(d => d.category === cat.id).reduce((acc, curr) => acc + curr.stock, 0)
    })).sort((a, b) => b.value - a.value);

    const stockByRegion = Object.entries(data.reduce((acc, curr) => {
        acc[curr.region] = (acc[curr.region] || 0) + curr.stock;
        return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    const criticalItems = data.filter(d => d.stock < 30).sort((a, b) => a.stock - b.stock).slice(0, 5);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#005696]" />
                        Regional Stock Distribution
                    </h3>
                    <div className="h-64 w-full flex items-end justify-around gap-4 px-4">
                        {stockByRegion.map((region, i) => {
                            const maxVal = Math.max(...stockByRegion.map(r => r.value));
                            const height = (region.value / maxVal) * 100;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                    <div className="relative w-full max-w-[60px] bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
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
                        })}
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
                                        style={{ width: `${(cat.value / totalStock) * 100}%`, backgroundColor: cat.color }}
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
                    <button className="text-sm text-[#005696] font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs">
                            <tr>
                                <th className="px-6 py-3">City</th>
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
                                    <td className="px-6 py-4 text-slate-500">{CATEGORIES.find(c => c.id === item.category)?.label}</td>
                                    <td className="px-6 py-4 font-mono text-red-600 font-bold">{item.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                            Critical Low
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onRestock(item.city, item.category)}
                                            className="text-xs font-medium text-white bg-[#005696] px-3 py-1.5 rounded hover:bg-[#00467a] transition-colors"
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {criticalItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
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

const InventoryTable = ({ data }) => {
    return (
        <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs tracking-wider sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">City</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Stock Level</th>
                        <th className="px-6 py-4">Top Selling Item</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {data.map((row, i) => (
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
                            <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]">{row.topItems[0]?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
