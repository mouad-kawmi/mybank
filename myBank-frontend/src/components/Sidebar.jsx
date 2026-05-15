import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ArrowLeftRight,
    Settings,
    LogOut,
    Building2,
    X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/' },
        { icon: <Users size={20} />, label: 'Utilisateurs', path: '/users' },
        { icon: <CreditCard size={20} />, label: 'Comptes Bancaires', path: '/accounts' },
        { icon: <ArrowLeftRight size={20} />, label: 'Transactions', path: '/transactions' },
    ];

    return (
        <aside className="h-screen w-64 glass border-r border-slate-800 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-10 px-2 text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-500/30">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-wider uppercase italic">MyBank</span>
                </div>
                <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-800">
                <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
