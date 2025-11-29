import React from 'react';
import { X } from 'lucide-react';

const SettingsModal = ({ show, onClose, settings, setSettings, onSave }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-[#005696] text-white rounded-md hover:bg-[#00467a] transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
