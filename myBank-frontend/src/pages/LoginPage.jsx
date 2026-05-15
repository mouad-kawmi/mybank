import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                if (form.password !== form.password_confirmation) {
                    setError('Les mots de passe ne correspondent pas.');
                    setLoading(false);
                    return;
                }
                await register(form);
            }
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message
                || Object.values(err.response?.data?.errors || {})[0]?.[0]
                || 'Une erreur est survenue.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(m => m === 'login' ? 'register' : 'login');
        setError('');
        setForm({ first_name: '', last_name: '', email: '', phone: '', password: '', password_confirmation: '' });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/30 mb-4">
                        <span className="text-white font-black text-2xl">MB</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest">MYBANK</h1>
                    <p className="text-slate-400 mt-1 text-sm">Votre banque de confiance</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => mode !== 'login' && switchMode()}
                            className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'login' ? 'text-white bg-slate-800/50 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => mode !== 'register' && switchMode()}
                            className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'register' ? 'text-white bg-slate-800/50 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Créer un compte
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-7 space-y-4">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    key="register-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Prénom</label>
                                            <div className="relative">
                                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text" name="first_name" required
                                                    value={form.first_name} onChange={handleChange}
                                                    placeholder="Prénom"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nom</label>
                                            <div className="relative">
                                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text" name="last_name" required
                                                    value={form.last_name} onChange={handleChange}
                                                    placeholder="Nom"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Téléphone</label>
                                        <div className="relative">
                                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="tel" name="phone"
                                                value={form.phone} onChange={handleChange}
                                                placeholder="+212 6XX-XXXXXX"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Adresse email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email" name="email" required
                                    value={form.email} onChange={handleChange}
                                    placeholder="exemple@email.com"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mot de passe</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password" required minLength={8}
                                    value={form.password} onChange={handleChange}
                                    placeholder="Min. 8 caractères"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-11 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {mode === 'register' && (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Confirmer le mot de passe</label>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password_confirmation" required
                                            value={form.password_confirmation} onChange={handleChange}
                                            placeholder="Répéter le mot de passe"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-sm"
                                >
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all text-sm
                                ${mode === 'login'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-600/30 hover:shadow-blue-600/50'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-600/30 hover:shadow-purple-600/50'
                                }
                                ${loading ? 'opacity-60 cursor-not-allowed' : ''}
                            `}
                        >
                            {loading
                                ? 'Chargement...'
                                : mode === 'login' ? 'Se connecter' : 'Créer mon compte'
                            }
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    MyBank © {new Date().getFullYear()} — Plateforme sécurisée
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
