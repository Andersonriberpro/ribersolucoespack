
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import ClientList from './components/ClientList';
import ProviderList from './components/ProviderList';
import ProductSpecificationList from './components/ProductSpecificationList';
import CommissionControl from './components/CommissionControl';
import BudgetList from './components/BudgetList';
import OrderList from './components/OrderList';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './components/AuthContext';

const App: React.FC = () => {
  const { user, loading, signOut, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const userName = useMemo(() => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (user) {
      return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
    }
    return 'Usuário';
  }, [user, userProfile]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Carregando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => { }} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'kanban':
        return <Kanban />;
      case 'clients':
        return <ClientList />;
      case 'finance':
        return <CommissionControl />;
      case 'providers':
        return <ProviderList />;
      case 'products':
        return <ProductSpecificationList />;
      case 'budgets':
        return <BudgetList />;
      case 'orders':
        return <OrderList />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userName={userName} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen custom-scrollbar">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} userName={userName} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
