import React, { useState } from 'react';
import { Send, Plus, ArrowRightLeft } from 'lucide-react';
import api from '../api/axios';

const QuickActions = ({ accounts, onRefresh }) => {
    const [type, setType] = useState('virement'); // 'virement', 'depot', 'retrait'
    const [amount, setAmount] = useState('');
    const [senderId, setSenderId] = useState('');
    const [senderSearch, setSenderSearch] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [receiverSearch, setReceiverSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!amount) return;
        if (type === 'virement' && (!senderId || !receiverId)) return;
        if (type === 'depot' && !receiverId) return;
        if (type === 'retrait' && !senderId) return;

        if (parseFloat(amount) <= 0) {
            alert("Le montant doit être supérieur à 0");
            return;
        }

        try {
            setLoading(true);
            await api.post('/transactions', {
                sender_account_id: type === 'depot' ? null : senderId,
                receiver_account_id: type === 'retrait' ? null : receiverId,
                transaction_type: type,
                amount: parseFloat(amount),
                transaction_reference: `${type.toUpperCase().substring(0, 3)}-${Date.now()}`,
                description: type === 'virement' ? 'Transfert instantané' : type === 'depot' ? 'Dépôt en espèces' : 'Retrait en espèces'
            });
            setAmount('');
            setSenderSearch('');
            setReceiverSearch('');
            setSenderId('');
            setReceiverId('');
            onRefresh();
            alert("Opération réussie !");
        } catch (error) {
            alert(error.response?.data?.error || "Le transfert a échoué");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <ArrowRightLeft className="text-primary-400" />
                    Opérations Rapides
                </h2>

                <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 border border-slate-800">
                    {['virement', 'depot', 'retrait'].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                type === t 
                                ? 'bg-primary-600 text-white shadow-lg' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleTransfer} className="space-y-4">
                    {(type === 'virement' || type === 'retrait') && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Compte Source</label>
                            <input
                                list="senders-list"
                                type="text"
                                placeholder="Saisir nom ou n° de compte..."
                                value={senderSearch}
                                onChange={(e) => {
                                    setSenderSearch(e.target.value);
                                    const match = accounts.find(acc => 
                                        `${acc.user?.first_name} ${acc.user?.last_name} - ${acc.account_number}` === e.target.value
                                    );
                                    if (match) setSenderId(match.id);
                                    else setSenderId('');
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                            <datalist id="senders-list">
                                {accounts.map(acc => (
                                    <option 
                                        key={acc.id} 
                                        value={`${acc.user?.first_name} ${acc.user?.last_name} - ${acc.account_number}`} 
                                    />
                                ))}
                            </datalist>
                        </div>
                    )}

                    {(type === 'virement' || type === 'depot') && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Compte Destinataire</label>
                            <input
                                list="receivers-list"
                                type="text"
                                placeholder="Saisir nom ou n° de compte..."
                                value={receiverSearch}
                                onChange={(e) => {
                                    setReceiverSearch(e.target.value);
                                    const match = accounts.find(acc => 
                                        `${acc.user?.first_name} ${acc.user?.last_name} - ${acc.account_number}` === e.target.value
                                    );
                                    if (match) setReceiverId(match.id);
                                    else setReceiverId('');
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                            <datalist id="receivers-list">
                                {accounts
                                    .filter(acc => acc.id.toString() !== senderId.toString())
                                    .map(acc => (
                                        <option 
                                            key={acc.id} 
                                            value={`${acc.user?.first_name} ${acc.user?.last_name} - ${acc.account_number}`} 
                                        />
                                    ))
                                }
                            </datalist>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Montant (MAD)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full ${type === 'depot' ? 'bg-emerald-600 hover:bg-emerald-500' : type === 'retrait' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-primary-600 hover:bg-primary-500'} disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 mt-4`}
                    >
                        {loading ? 'Traitement...' : <><Send size={18} /> {type === 'virement' ? "Envoyer l'Argent" : type === 'depot' ? "Effectuer le Dépôt" : "Confirmer le Retrait"}</>}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default QuickActions;
