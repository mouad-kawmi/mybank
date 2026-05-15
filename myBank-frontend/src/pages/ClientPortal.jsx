import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
    Download, User, Phone, Mail, Shield, Send, X, AlertCircle, CheckCircle
} from 'lucide-react';

const ClientPortal = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showVirement, setShowVirement] = useState(false);
    const [virementForm, setVirementForm] = useState({ sender_account_id: '', rib: '', amount: '', description: '' });
    const [virementLoading, setVirementLoading] = useState(false);
    const [virementMsg, setVirementMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchClientData();
    }, []);

    const fetchClientData = async () => {
        try {
            setLoading(true);
            const [accRes, txRes] = await Promise.all([
                api.get('/bank-accounts'),
                api.get('/transactions'),
            ]);

            const myAccounts = accRes.data.filter(a => a.user_id === user.id);
            const myAccountIds = myAccounts.map(a => a.id);

            const myTx = txRes.data.filter(tx =>
                myAccountIds.includes(tx.sender_account_id) ||
                myAccountIds.includes(tx.receiver_account_id)
            );

            setAccounts(myAccounts);
            setTransactions(myTx);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0);

    const handleDownloadReceipt = async (tx) => {
        try {
            const response = await api.get(`/transactions/${tx.id}/receipt`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recu_${tx.transaction_reference}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Impossible de télécharger le reçu.');
        }
    };

    const handleVirement = async (e) => {
        e.preventDefault();
        setVirementLoading(true);
        setVirementMsg({ type: '', text: '' });
        try {
            const allAccRes = await api.get('/bank-accounts');
            const receiver = allAccRes.data.find(a => a.account_number === virementForm.rib.trim());
            if (!receiver) {
                setVirementMsg({ type: 'error', text: 'RIB introuvable. Vérifiez le numéro de compte.' });
                setVirementLoading(false);
                return;
            }
            if (receiver.id === parseInt(virementForm.sender_account_id)) {
                setVirementMsg({ type: 'error', text: 'Vous ne pouvez pas vous virer à vous-même.' });
                setVirementLoading(false);
                return;
            }
            const ref = 'VIR-' + Date.now();
            await api.post('/transactions', {
                sender_account_id: parseInt(virementForm.sender_account_id),
                receiver_account_id: receiver.id,
                transaction_type: 'virement',
                amount: parseFloat(virementForm.amount),
                description: virementForm.description || `Virement vers ${receiver.account_number}`,
                transaction_reference: ref,
            });
            setVirementMsg({ type: 'success', text: 'Virement effectué avec succès !' });
            setVirementForm({ sender_account_id: accounts[0]?.id || '', rib: '', amount: '', description: '' });
            fetchClientData();
            setTimeout(() => { setShowVirement(false); setVirementMsg({ type: '', text: '' }); }, 2000);
        } catch (err) {
            const msg = err.response?.data?.error || 'Erreur lors du virement.';
            setVirementMsg({ type: 'error', text: msg });
        } finally {
            setVirementLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-slate-900 via-primary-900/30 to-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest">Bienvenue</p>
                        <h1 className="text-3xl font-black text-white">
                            {user?.first_name} <span className="text-primary-400">{user?.last_name}</span>
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Votre espace bancaire personnel</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-slate-400 text-xs uppercase tracking-widest">Solde total</p>
                        <p className="text-4xl font-black text-white">
                            {totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                            <span className="text-lg text-slate-400 font-normal ml-2">MAD</span>
                        </p>
                        <span className="text-xs bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-400/20">
                            {accounts.length} compte{accounts.length > 1 ? 's' : ''} actif{accounts.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6"
                >
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <User size={14} /> Mes Informations
                    </h2>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">{user?.first_name} {user?.last_name}</p>
                            <span className="text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 bg-slate-800 rounded-lg"><Mail size={14} className="text-slate-400" /></div>
                            <div>
                                <p className="text-slate-500 text-[10px] uppercase">Email</p>
                                <p className="text-slate-200 font-medium">{user?.email}</p>
                            </div>
                        </div>
                        {user?.phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-slate-800 rounded-lg"><Phone size={14} className="text-slate-400" /></div>
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase">Téléphone</p>
                                    <p className="text-slate-200 font-medium">{user.phone}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 bg-slate-800 rounded-lg"><Shield size={14} className="text-slate-400" /></div>
                            <div>
                                <p className="text-slate-500 text-[10px] uppercase">Statut</p>
                                <p className="text-emerald-400 font-bold capitalize">{user?.status}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {[
                        { label: 'Mes Comptes', value: accounts.length, icon: <CreditCard size={22} />, color: 'text-primary-400', bg: 'bg-primary-400/10' },
                        { label: 'Transactions', value: transactions.length, icon: <ArrowLeftRight size={22} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        {
                            label: 'Total Entrant',
                            value: `${transactions.filter(t => t.transaction_type === 'depot' || accounts.map(a => a.id).includes(t.receiver_account_id)).reduce((s, t) => s + parseFloat(t.amount), 0).toLocaleString()} MAD`,
                            icon: <ArrowDownLeft size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10'
                        },
                        {
                            label: 'Total Sortant',
                            value: `${transactions.filter(t => t.transaction_type === 'retrait' || accounts.map(a => a.id).includes(t.sender_account_id)).reduce((s, t) => s + parseFloat(t.amount), 0).toLocaleString()} MAD`,
                            icon: <ArrowUpRight size={22} />, color: 'text-rose-400', bg: 'bg-rose-400/10'
                        },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="glass rounded-2xl p-5 flex items-center gap-4"
                        >
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} flex-shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard size={14} /> Mes Comptes Bancaires
                </h2>
                {accounts.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center text-slate-500 italic">
                        Aucun compte bancaire associé à votre profil.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {accounts.map((acc, idx) => (
                            <motion.div
                                key={acc.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.08 }}
                                className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 overflow-hidden group hover:border-primary-500/40 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <CreditCard size={90} />
                                </div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-primary-600/20 transition-colors">
                                        <CreditCard size={20} className="text-primary-400" />
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${acc.status === 'active' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-rose-400/15 text-rose-400'}`}>
                                        {acc.status === 'active' ? 'Actif' : acc.status}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Compte {acc.account_type}</p>
                                    <p className="text-white font-mono font-bold text-sm mb-4 tracking-wider">{acc.account_number}</p>
                                    <div className="border-t border-slate-700/50 pt-4">
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Solde disponible</p>
                                        <p className="text-2xl font-black text-white mt-1">
                                            {parseFloat(acc.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                            <span className="text-sm text-slate-400 font-normal ml-1">{acc.currency}</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showVirement && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            onClick={() => setShowVirement(false)} />
                        <motion.div initial={{opacity:0, scale:0.9, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.9}}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-primary-900/30 to-slate-900">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-600/20 rounded-xl"><Send size={18} className="text-primary-400" /></div>
                                    <div>
                                        <h2 className="text-white font-bold">Nouveau Virement</h2>
                                        <p className="text-slate-400 text-xs">Saisissez le RIB du bénéficiaire</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowVirement(false)} className="text-slate-400 hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleVirement} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Compte source</label>
                                    <select required value={virementForm.sender_account_id}
                                        onChange={e => setVirementForm(p => ({...p, sender_account_id: e.target.value}))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500">
                                        <option value="">Choisir un compte</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id}>
                                                {a.account_number} — {parseFloat(a.balance).toLocaleString()} {a.currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">RIB du bénéficiaire</label>
                                    <input required type="text" placeholder="ex. BK-1234567890"
                                        value={virementForm.rib}
                                        onChange={e => setVirementForm(p => ({...p, rib: e.target.value}))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Montant (MAD)</label>
                                    <input required type="number" min="1" step="0.01" placeholder="0.00"
                                        value={virementForm.amount}
                                        onChange={e => setVirementForm(p => ({...p, amount: e.target.value}))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Motif (optionnel)</label>
                                    <input type="text" placeholder="Ex: Remboursement..."
                                        value={virementForm.description}
                                        onChange={e => setVirementForm(p => ({...p, description: e.target.value}))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500" />
                                </div>
                                {virementMsg.text && (
                                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                                        virementMsg.type === 'error' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                                        {virementMsg.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                                        {virementMsg.text}
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowVirement(false)}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                                        Annuler
                                    </button>
                                    <button type="submit" disabled={virementLoading}
                                        className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                        {virementLoading ? 'Envoi...' : <><Send size={16}/> Envoyer</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ArrowLeftRight size={14} /> Mes Transactions Récentes
                    </h2>
                    {accounts.length > 0 && (
                        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                            onClick={() => { setShowVirement(true); setVirementForm({sender_account_id: accounts[0]?.id || '', rib:'', amount:'', description:''}); setVirementMsg({type:'',text:''}); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all">
                            <Send size={13}/> Nouveau Virement
                        </motion.button>
                    )}
                </div>
                {transactions.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center text-slate-500 italic">
                        Aucune transaction trouvée.
                    </div>
                ) : (
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900/60 border-b border-slate-800">
                                        <th className="px-6 py-4">Référence</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Montant</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-center">Reçu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/40">
                                    {transactions.slice(0, 10).map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="hover:bg-slate-800/20 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-white font-mono font-bold text-xs">{tx.transaction_reference}</p>
                                                <p className="text-slate-500 text-[10px] mt-0.5">{tx.description || '—'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    tx.transaction_type === 'depot' ? 'bg-emerald-400/10 text-emerald-400'
                                                    : tx.transaction_type === 'retrait' ? 'bg-rose-400/10 text-rose-400'
                                                    : 'bg-primary-400/10 text-primary-400'
                                                }`}>
                                                    {tx.transaction_type === 'depot' ? <ArrowDownLeft size={12} />
                                                    : tx.transaction_type === 'retrait' ? <ArrowUpRight size={12} />
                                                    : <ArrowLeftRight size={12} />}
                                                    {tx.transaction_type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`font-black text-sm ${tx.transaction_type === 'depot' ? 'text-emerald-400' : 'text-slate-100'}`}>
                                                    {tx.transaction_type === 'depot' ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()} MAD
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    tx.status === 'completed' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-slate-400/15 text-slate-400'
                                                }`}>{tx.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                                                {new Date(tx.created_at).toLocaleString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDownloadReceipt(tx)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 hover:border-primary-500/40 transition-all"
                                                >
                                                    <Download size={11} /> PDF
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientPortal;
