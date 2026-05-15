import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
               <span className="font-black text-white text-xs">MB</span>
             </div>
             <span className="font-bold text-white tracking-widest text-sm">MYBANK</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
