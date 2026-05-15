import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, Search, MoreVertical, Shield, User as UserIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'client',
        status: 'active'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/users', formData);
            setIsModalOpen(false);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: 'password123',
                phone: '',
                role: 'client',
                status: 'active'
            });
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Échec de l'ajout de l'utilisateur. Vérifiez si l'email est unique.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
        setFormData(prev => ({ ...prev, password: pass }));
    };

    const filteredUsers = users.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Utilisateurs</h1>
                    <p className="text-slate-400 mt-1">Gérez et surveillez les clients de votre banque.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all"
                >
                    <UserPlus size={18} />
                    Ajouter un Utilisateur
                </button>
            </header>

            <div className="glass rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par nom ou email..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <span className="text-sm text-slate-400">Utilisateurs Totaux: <span className="text-white font-bold">{users.length}</span></span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase tracking-widest bg-slate-900/30">
                                <th className="px-8 py-4">Client</th>
                                <th className="px-8 py-4 whitespace-nowrap">Rôle</th>
                                <th className="px-8 py-4 whitespace-nowrap">Statut</th>
                                <th className="px-8 py-4 whitespace-nowrap">Téléphone</th>
                                <th className="px-8 py-4 whitespace-nowrap">Inscription</th>
                                <th className="px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredUsers.map((user, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={user.id}
                                    className="hover:bg-slate-800/20 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-colors flex-shrink-0">
                                                <UserIcon size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold truncate">{user.first_name} {user.last_name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                                            <span className="text-sm text-slate-300 capitalize">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 text-sm whitespace-nowrap">{user.phone || 'N/A'}</td>
                                    <td className="px-8 py-5 text-slate-400 text-sm whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-slate-500 hover:text-white p-2">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-20 text-slate-500 italic">
                        Aucun utilisateur trouvé pour cette recherche.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                <h2 className="text-xl font-bold text-white">Ajouter un Nouvel Utilisateur</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom</label>
                                        <input
                                            required
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            placeholder="Saisire le prénom"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                                        <input
                                            required
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            placeholder="Saisire le nom"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Adresse Email</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Saisire l'adresse email"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Numéro de Téléphone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+212 600 000 000"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                                        Mot de passe
                                        <button type="button" onClick={generatePassword} className="text-primary-400 hover:text-primary-300 normal-case font-normal text-[10px]">Générer</button>
                                    </label>
                                    <input
                                        placeholder="********"
                                        required
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Rôle</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none"
                                        >
                                            <option value="client">Client</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Statut</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors appearance-none"
                                        >
                                            <option value="active">Actif</option>
                                            <option value="blocked">Bloqué</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-600/20 transition-all"
                                    >
                                        {isSubmitting ? 'Ajout...' : "Créer l'Utilisateur"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersPage;
