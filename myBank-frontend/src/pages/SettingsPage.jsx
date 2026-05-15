import React from 'react';
import { User, Bell, Shield, Wallet, Globe, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const sections = [
        {
            title: "Profil Administrateur",
            icon: <User className="text-primary-400" />,
            fields: [
                { label: "Nom complet", value: "Administrateur Système" },
                { label: "Adresse Email", value: "admin@mybank.ma" },
                { label: "Rôle", value: "Super Admin" }
            ]
        },
        {
            title: "Configuration de la Banque",
            icon: <Globe className="text-emerald-400" />,
            fields: [
                { label: "Nom de l'Institution", value: "MyBank Morocco" },
                { label: "Devise par défaut", value: "MAD (Dirham Marocain)" },
                { label: "Fuseau horaire", value: "(GMT+01:00) Casablanca" }
            ]
        },
        {
            title: "Sécurité & Système",
            icon: <Shield className="text-rose-400" />,
            fields: [
                { label: "Authentification", value: "Activée (2FA)" },
                { label: "Version du Système", value: "v2.0.4-premium" },
                { label: "Dernière sauvegarde", value: "Aujourd'hui à 04:00" }
            ]
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white">Paramètres</h1>
                <p className="text-slate-400 mt-1">Gérez les configurations globales de votre portail bancaire.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-8 rounded-[2.5rem] border border-slate-800/50"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                                {section.icon}
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{section.title}</h2>
                        </div>

                        <div className="space-y-6">
                            {section.fields.map((field, fIdx) => (
                                <div key={fIdx} className="group">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-primary-400 transition-colors">{field.label}</p>
                                    <p className="text-lg font-medium text-slate-200">{field.value}</p>
                                </div>
                            ))}
                        </div>

                        <button className="mt-8 w-full py-3 bg-slate-900 border border-slate-800 hover:border-primary-500/50 text-slate-400 hover:text-white rounded-xl font-bold transition-all text-sm uppercase tracking-widest">
                            Modifier la section
                        </button>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-8 rounded-[2.5rem] border border-slate-800/50 bg-gradient-to-br from-primary-600/10 to-transparent flex flex-col justify-center items-center text-center"
                >
                    <Database className="w-12 h-12 text-primary-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Base de Données</h2>
                    <p className="text-slate-400 text-sm mb-6 max-w-[250px]">L'intégrité du système est surveillée en temps réel. Toutes les transactions sont chiffrées.</p>
                    <div className="flex gap-2">
                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">Connecté</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
