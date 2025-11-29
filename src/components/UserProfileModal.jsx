import React from 'react';
import { X, User as UserIcon, Mail, Phone, Shield, LogOut } from 'lucide-react';

const UserProfileModal = ({ show, onClose, onLogout }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
