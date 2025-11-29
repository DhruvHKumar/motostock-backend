import React from 'react';
import { Search, Bell, Settings, X } from 'lucide-react';

const Header = ({
    activeTab,
    searchTerm,
    setSearchTerm,
    showNotifications,
    setShowNotifications,
    unreadCount,
    notifications,
    markAsRead,
    clearNotification,
    onSettingsClick
}) => {
    return (
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
                                                        {notif.item ? `${notif.item} (${notif.category})` : notif.category} in {notif.city}
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
                    onClick={onSettingsClick}
                    className="p-2 text-slate-500 hover:text-[#005696] hover:bg-slate-100 rounded-full transition-all"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
