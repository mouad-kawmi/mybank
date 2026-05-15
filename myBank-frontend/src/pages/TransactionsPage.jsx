import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ArrowDownLeft, ArrowUpRight, History, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Audit des Transactions</h1>
                    <p className="text-slate-400 mt-1">Registre complet des transactions et audit du système.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filtrer par référence, compte..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </header>

            <div className="glass rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase tracking-widest bg-slate-900/50">
                                <th className="px-8 py-5 whitespace-nowrap">Référence</th>
                                <th className="px-8 py-5 whitespace-nowrap">Type</th>
                                <th className="px-8 py-5 whitespace-nowrap">Participants</th>
                                <th className="px-8 py-5 whitespace-nowrap">Montant</th>
                                <th className="px-8 py-5 whitespace-nowrap">Statut</th>
                                <th className="px-8 py-5 whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {transactions
                                .filter(tx => 
                                    tx.transaction_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (tx.sender_account?.account_number || '').includes(searchTerm) ||
                                    (tx.receiver_account?.account_number || '').includes(searchTerm) ||
                                    (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((tx, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    key={tx.id}
                                    className="hover:bg-slate-800/10 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <p className="text-white font-mono font-bold text-sm whitespace-nowrap">{tx.transaction_reference}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{tx.description || 'Global Transaction'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.transaction_type === 'depot' ? 'bg-emerald-400/10 text-emerald-400' :
                                                    tx.transaction_type === 'retrait' ? 'bg-rose-400/10 text-rose-400' :
                                                        'bg-primary-400/10 text-primary-400'
                                                }`}>
                                                {tx.transaction_type === 'depot' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <span className="text-sm font-bold capitalize text-slate-300">{tx.transaction_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs space-y-1 min-w-[200px]">
                                            {tx.sender_account && <p className="text-slate-400">De: <span className="text-slate-200 font-bold">{tx.sender_account.account_number}</span></p>}
                                            {tx.receiver_account && <p className="text-slate-400">À: <span className="text-slate-200 font-bold">{tx.receiver_account.account_number}</span></p>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className={`text-lg font-black whitespace-nowrap ${tx.transaction_type === 'depot' ? 'text-emerald-400' : 'text-slate-50'
                                            }`}>
                                            {tx.transaction_type === 'depot' ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()} MAD
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${tx.status === 'success' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-rose-400/20 text-rose-400'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.length === 0 && (
                    <div className="text-center py-20 text-slate-500 italic">
                        Aucun enregistrement de transaction trouvé.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;
