import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';

const TransactionList = ({ transactions, onRefresh }) => {
    return (
        <div className="glass rounded-3xl p-8 h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white">Transactions Récentes</h2>
                    <p className="text-sm text-slate-400 mt-1">Mise à jour en temps réel des activités des comptes.</p>
                </div>
                <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.map((tx, index) => (
                    <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors gap-4"
                    >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className={`p-3 rounded-xl flex-shrink-0 ${tx.transaction_type === 'depot' ? 'bg-emerald-400/10 text-emerald-400' :
                                    tx.transaction_type === 'retrait' ? 'bg-rose-400/10 text-rose-400' :
                                        'bg-primary-400/10 text-primary-400'
                                }`}>
                                {tx.transaction_type === 'depot' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-white truncate">{tx.description || 'Transaction'}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate font-mono">{tx.transaction_reference}</p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto pl-14 sm:pl-0">
                            <p className={`font-black text-lg leading-none mb-1 ${tx.transaction_type === 'depot' ? 'text-emerald-400' : 'text-white'
                                }`}>
                                {tx.transaction_type === 'depot' ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()} <span className="text-[10px] opacity-50">MAD</span>
                            </p>
                            <p className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                    </motion.div>
                ))}
                {transactions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 italic">Aucune transaction trouvée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
