
import React from 'react';
import { useAuth } from './AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, userName }) => {
  const { userProfile } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { id: 'kanban', icon: 'fa-columns', label: 'Funil de Vendas' },
    { id: 'clients', icon: 'fa-users', label: 'Clientes & Leads' },
    { id: 'providers', icon: 'fa-industry', label: 'Fornecedores' },
    { id: 'products', icon: 'fa-flask', label: 'Especificação Técnica' },
    { id: 'budgets', icon: 'fa-file-invoice-dollar', label: 'Orçamentos' },
    { id: 'orders', icon: 'fa-shopping-cart', label: 'Pedidos' },
    { id: 'finance', icon: 'fa-hand-holding-usd', label: 'Comissões' },
  ];

  const roleLabel = userProfile?.role === 'admin' ? 'Administrador' : userProfile?.role === 'viewer' ? 'Visualizador' : 'Usuário';

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-transparent dark:border-slate-900 transition-colors">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <i className="fas fa-scroll text-xl"></i>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-white font-bold text-lg leading-tight truncate">RiberPack</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black truncate">Ribersoluções</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${activeTab === item.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'
              }`}
          >
            <i className={`fas ${item.icon} w-6 text-center flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}></i>
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-slate-800 dark:bg-slate-900"></div>
        </div>

        {/* Admin Button */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${activeTab === 'admin'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'
            }`}
        >
          <i className={`fas fa-cog w-6 text-center flex-shrink-0 ${activeTab === 'admin' ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}></i>
          <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">Administração</span>
        </button>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800 dark:border-slate-900 space-y-2">
        <button
          onClick={() => setActiveTab('admin')}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-800 transition-all cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 flex-shrink-0 overflow-hidden">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center">
                <i className="fas fa-user text-indigo-400 text-xs"></i>
              </div>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold text-white truncate">{userProfile?.full_name || userName}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-tighter">{roleLabel}</p>
          </div>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <i className="fas fa-sign-out-alt"></i>
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

