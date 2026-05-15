import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';
import QuickActions from '../components/QuickActions';
import api from '../api/axios';
import { Wallet, ArrowDownUp, TrendingUp, CreditCard } from 'lucide-react';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, accountsRes, transactionsRes] = await Promise.all([
                api.get('/users'),
                api.get('/bank-accounts'),
                api.get('/transactions')
            ]);
            setUsers(usersRes.data);
            setAccounts(accountsRes.data);
            setTransactions(transactionsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

    return (
        <div>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Tableau de bord</h1>
                    <p className="text-slate-400 mt-1">Bienvenue sur votre portail bancaire premium.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">Administrateur</p>
                        <p className="text-xs text-slate-400">admin@bank.com</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                        AD
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Actifs Totaux"
                    value={`${totalBalance.toLocaleString()} MAD`}
                    icon={<Wallet className="w-6 h-6 text-emerald-400" />}
                    trend="+12.5%"
                />
                <StatCard
                    title="Comptes Actifs"
                    value={accounts.length.toString()}
                    icon={<CreditCard className="w-6 h-6 text-primary-400" />}
                />
                <StatCard
                    title="Utilisateurs Totaux"
                    value={users.length.toString()}
                    icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
                />
                <StatCard
                    title="Transactions Totales"
                    value={transactions.length.toString()}
                    icon={<ArrowDownUp className="w-6 h-6 text-purple-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <TransactionList transactions={transactions} onRefresh={fetchData} />
                </div>
                <div className="space-y-8">
                    <QuickActions accounts={accounts} onRefresh={fetchData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
