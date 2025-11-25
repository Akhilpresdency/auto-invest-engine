import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Zap, 
  BrainCircuit, 
  Settings, 
  Menu, 
  X,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  id, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  id: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={() => onClick()}
    className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500 rounded-r-none' 
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, systemStatus }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-gray-800 rounded-md border border-gray-700"
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Activity className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-lg font-bold tracking-tight text-white">{APP_NAME}</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            <SidebarItem 
              id="dashboard" 
              label="Dashboard" 
              icon={LayoutDashboard} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              id="analysis" 
              label="Market Intelligence" 
              icon={BrainCircuit} 
              active={activeTab === 'analysis'} 
              onClick={() => setActiveTab('analysis')} 
            />
            <SidebarItem 
              id="execution" 
              label="Live Execution" 
              icon={Zap} 
              active={activeTab === 'execution'} 
              onClick={() => setActiveTab('execution')} 
            />
            <SidebarItem 
              id="backtest" 
              label="Strategy Lab" 
              icon={LineChart} 
              active={activeTab === 'backtest'} 
              onClick={() => setActiveTab('backtest')} 
            />
            <div className="pt-6 mt-6 border-t border-gray-800">
              <SidebarItem 
                id="settings" 
                label="System Config" 
                icon={Settings} 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')} 
              />
            </div>
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  systemStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-xs font-mono text-gray-400">CORE: {systemStatus}</span>
              </div>
              <ShieldAlert className="w-4 h-4 text-gray-600 hover:text-red-500 cursor-pointer" title="Risk Checks" />
            </div>
            <div className="mt-2 text-[10px] text-gray-600 font-mono">
              Latency: 24ms | API: 99.9%
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-950">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};