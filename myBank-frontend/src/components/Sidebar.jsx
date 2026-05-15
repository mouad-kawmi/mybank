import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, CreditCard,
    ArrowLeftRight, LogOut, Building2, X,
    ChevronRight, UserCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';

    const adminMenu = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/' },
        { icon: <Users size={20} />, label: 'Utilisateurs', path: '/users' },
        { icon: <CreditCard size={20} />, label: 'Comptes Bancaires', path: '/accounts' },
        { icon: <ArrowLeftRight size={20} />, label: 'Transactions', path: '/transactions' },
    ];

    const clientMenu = [
        { icon: <UserCircle size={20} />, label: 'Mon Espace', path: '/' },
    ];

    const menuItems = isAdmin ? adminMenu : clientMenu;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

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

            <div className={`mb-6 px-4 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border
                ${isAdmin
                    ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                    : 'bg-primary-400/10 text-primary-400 border-primary-400/20'
                }`}>
                {isAdmin ? '👑 Espace Administrateur' : '🏦 Espace Client'}
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-800 space-y-3">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-xs">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">{user.role}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-rose-400 hover:bg-rose-400/10 transition-colors group"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
