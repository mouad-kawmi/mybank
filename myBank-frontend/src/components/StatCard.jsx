import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl group hover:border-primary-500/50 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-slate-700 transition-colors">
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
