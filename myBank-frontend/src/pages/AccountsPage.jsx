import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, CreditCard, ArrowUpRight, Scale, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        account_number: '',
        account_type: 'courant',
        balance: 0,
        currency: 'MAD',
        status: 'active'
    });

    useEffect(() => {
        fetchAccounts();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, user_id: res.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/bank-accounts');
            setAccounts(res.data);
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

    const generateAccountNumber = () => {
        const num = 'BK-' + Math.random().toString().slice(2, 12);
        setFormData(prev => ({ ...prev, account_number: num }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (parseFloat(formData.balance) < 0) {
            alert("Le solde initial ne peut pas être négatif.");
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post('/bank-accounts', formData);
            setIsModalOpen(false);
            setFormData({
                user_id: users[0]?.id || '',
                account_number: '',
                account_type: 'courant',
                balance: 0,
                currency: 'MAD',
                status: 'active'
            });
            fetchAccounts();
        } catch (err) {
            console.error(err);
            alert("Échec de la création du compte. Vérifiez si le numéro de compte est unique.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Comptes Bancaires</h1>
                    <p className="text-slate-400 mt-1">Aperçu de tous les comptes bancaires actifs.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                    <Plus size={18} />
                    Nouveau Compte
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map((acc, idx) => (
                    <motion.div
                        key={acc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                            <CreditCard size={120} className="text-white" />
                        </div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-emerald-600 transition-colors">
                                <CreditCard size={24} className="text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${acc.status === 'active' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-rose-400/20 text-rose-400'
                                }`}>
                                {acc.status}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Compte {acc.account_type}</p>
                            <h3 className="text-xl font-black text-white tracking-widest mb-6">{acc.account_number}</h3>

                            <div className="flex justify-between items-end border-t border-slate-800 pt-6">
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Solde Disponible</p>
                                    <p className="text-2xl font-black text-white">{parseFloat(acc.balance).toLocaleString()} <span className="text-sm text-slate-400 font-normal">MAD</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Propriétaire</p>
                                    <p className="text-slate-300 font-bold">{acc.user?.first_name} {acc.user?.last_name}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {accounts.length === 0 && (
                <div className="text-center py-40 glass rounded-[2.5rem]">
                    <CreditCard size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500 italic">Aucun compte bancaire trouvé.</p>
                </div>
            )}

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
                                <h2 className="text-xl font-bold text-white">Créer un Nouveau Compte Bancaire</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Titulaire du Compte (Utilisateur)</label>
                                    <select
                                        required
                                        name="user_id"
                                        value={formData.user_id}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Sélectionner un utilisateur</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                                        Numéro de Compte
                                        <button type="button" onClick={generateAccountNumber} className="text-emerald-500 hover:text-emerald-400 normal-case font-normal text-[10px]">Générer automatiquement</button>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="account_number"
                                        value={formData.account_number}
                                        onChange={handleInputChange}
                                        placeholder="ex. BK-1234567890"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Solde Initial</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="balance"
                                            value={formData.balance}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Devise</label>
                                        <input
                                            required
                                            type="text"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type de Compte</label>
                                        <select
                                            name="account_type"
                                            value={formData.account_type}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                        >
                                            <option value="courant">Courant</option>
                                            <option value="epargne">Épargne</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Statut</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                        >
                                            <option value="active">Actif</option>
                                            <option value="suspended">Suspendu</option>
                                            <option value="closed">Fermé</option>
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
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                                    >
                                        {isSubmitting ? 'Création...' : 'Créer le Compte'}
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

export default AccountsPage;
