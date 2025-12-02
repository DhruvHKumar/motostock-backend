import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Loader2, Check, X } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import GeoDashboard from './components/GeoDashboard';
import InventoryTable from './components/InventoryTable';
import SettingsModal from './components/SettingsModal';
import UserProfileModal from './components/UserProfileModal';

// Constants
import { RAW_CITIES, CATEGORIES, GOOGLE_SHEET_URL, N8N_WEBHOOK_URL, N8N_WEBHOOK_URL2 } from './constants';

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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Data Fetching with Caching
    useEffect(() => {
        const fetchData = (isBackgroundRefresh = false) => {
            // Only show loader if it's NOT a background refresh
            if (!isBackgroundRefresh) setLoading(true);

            Papa.parse(GOOGLE_SHEET_URL, {
                download: true,
                header: true,
                complete: (results) => {
                    const parsedData = results.data;

                    // Process data
                    const processedData = [];

                    parsedData.forEach((row, index) => {
                        if (!row.City || !row.Category) return;

                        const city = row.City.trim();
                        const region = row.Region ? row.Region.trim() : null;
                        const categoryLabel = row.Category.trim();
                        const categoryId = CATEGORIES.find(c => c.label.toLowerCase() === categoryLabel.toLowerCase())?.id || 'maintenance';
                        const item = row['Accessory Name'];
                        const stock = parseInt(row.Stock) || 0;
                        const demand = row.Demand;

                        // Find lat/lng from RAW_CITIES or default to center
                        const cityInfo = RAW_CITIES.find(c => c.name === city);

                        // If city not found in RAW_CITIES, try to infer region or use a default
                        let finalRegion = region;
                        if (!finalRegion && cityInfo) {
                            finalRegion = cityInfo.region;
                        }

                        processedData.push({
                            id: index,
                            city: city,
                            region: finalRegion,
                            lat: cityInfo?.lat || 20.5937,
                            lng: cityInfo?.lng || 78.9629,
                            category: categoryId,
                            item: item,
                            stock: stock,
                            demand: demand === 'High' ? 'High' : 'Normal'
                        });
                    });

                    // Debug: Log region distribution
                    const regionCounts = processedData.reduce((acc, item) => {
                        const reg = item.region || 'Unknown';
                        acc[reg] = (acc[reg] || 0) + 1;
                        return acc;
                    }, {});
                    console.log('Region distribution:', regionCounts);

                    // Update State
                    setData(processedData);
                    setLoading(false);

                    // Cache Data
                    localStorage.setItem('motostock_data', JSON.stringify(processedData));
                    localStorage.setItem('motostock_last_updated', new Date().toISOString());
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    setLoading(false);
                }
            });
        };

        // 1. Try to load from cache first
        const cachedData = localStorage.getItem('motostock_data');
        let hasCache = false;

        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (parsed && parsed.length > 0) {
                    setData(parsed);
                    setLoading(false);
                    hasCache = true;
                }
            } catch (e) {
                console.error("Cache parse error", e);
            }
        }

        // 2. Fetch fresh data (background if cache exists, foreground if not)
        fetchData(hasCache);

        // 3. Setup Auto-refresh
        let interval;
        if (settings.autoRefresh) {
            interval = setInterval(() => fetchData(true), settings.refreshInterval * 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [settings.autoRefresh, settings.refreshInterval]);

    const filteredData = useMemo(() => {
        return data.filter(d => {
            const regionMatch = selectedRegion === 'All' || d.region === selectedRegion;
            const searchMatch = d.city.toLowerCase().includes(searchTerm.toLowerCase());
            return regionMatch && searchMatch;
        });
    }, [data, selectedRegion, searchTerm]);

    const addNotification = (city, category, itemName) => {
        // 1. Immediate "Processing" Feedback
        setToast({
            message: `AI Agent: Analyzing restock requirements for ${itemName}...`,
            type: 'info' // You might want to style 'info' differently or just use success/default
        });

        // 2. Simulate AI Processing Delay (e.g., 2 seconds)
        setTimeout(() => {
            const newNotification = {
                id: Date.now(),
                city,
                category: CATEGORIES.find(c => c.id === category)?.label || category,
                item: itemName,
                timestamp: new Date(),
                read: false
            };

            setNotifications(prev => [newNotification, ...prev]);

            // 3. Show Success Message
            setToast({
                message: `Restock request approved and initiated for ${itemName}.`,
                type: 'success'
            });

            // 4. Update Local Data to "Remove" from Low Stock List
            // We do this by artificially increasing the stock to a safe level (e.g., 50)
            setData(prevData => prevData.map(item => {
                if (item.city === city && item.item === itemName) {
                    return { ...item, stock: 50 }; // Set to 50 to move it out of "Low Stock" (<30)
                }
                return item;
            }));

            // Hide toast after a few seconds
            setTimeout(() => setToast(null), 4000);

        }, 2000); // 2 second delay for "AI" feel
    };

    const handleShiftStock = (sourceCity, targetCity, itemName, amount) => {
        // Update local data
        setData(prevData => prevData.map(item => {
            if (item.item === itemName) {
                if (item.city === sourceCity) {
                    return { ...item, stock: item.stock - amount };
                }
                if (item.city === targetCity) {
                    return { ...item, stock: item.stock + amount };
                }
            }
            return item;
        }));

        setToast({
            message: `Successfully transferred ${amount} units of ${itemName} from ${sourceCity} to ${targetCity}.`,
            type: 'success'
        });

        setTimeout(() => setToast(null), 4000);
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
            <SettingsModal
                show={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                setSettings={setSettings}
                onSave={() => {
                    setShowSettings(false);
                    setToast({ message: 'Settings saved successfully', type: 'success' });
                    setTimeout(() => setToast(null), 3000);
                }}
            />

            <UserProfileModal
                show={showUserProfile}
                onClose={() => setShowUserProfile(false)}
                onLogout={() => {
                    setShowUserProfile(false);
                    setToast({ message: 'Logged out successfully', type: 'success' });
                    setTimeout(() => setToast(null), 3000);
                }}
            />

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

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onProfileClick={() => setShowUserProfile(true)}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
                <Header
                    activeTab={activeTab}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                    unreadCount={unreadCount}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    clearNotification={clearNotification}
                    onSettingsClick={() => setShowSettings(true)}
                />

                {/* Content Area */}
                <div className="flex-1 relative overflow-hidden p-6 overflow-y-auto">
                    {loading && data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#005696]" />
                            <p className="font-medium">Loading live data...</p>
                        </div>
                    ) : (
                        <>
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
                                    <InventoryTable
                                        data={filteredData}
                                        allData={data}
                                        onRestock={addNotification}
                                        onShiftStock={handleShiftStock}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
