
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar, footer, isDarkMode }) => {
  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* macOS Style Header */}
      <header className="h-12 w-full sidebar-blur border-b border-black/5 dark:border-white/10 flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm"></div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="material-symbols-outlined text-primary text-xl">analytics</span>
            <span>微博情绪分析助手</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-medium opacity-60">
            {['文件', '编辑', '视图', '分析'].map(item => (
              <span key={item} className="cursor-default hover:opacity-100 transition-opacity">{item}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="material-symbols-outlined text-xl opacity-60 hover:opacity-100 transition-opacity">settings</button>
            <button className="material-symbols-outlined text-xl opacity-60 hover:opacity-100 transition-opacity">help_outline</button>
            <img 
              alt="Profile" 
              className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10" 
              src="https://picsum.photos/seed/user/100/100" 
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        <main className="flex-1 overflow-y-auto p-6 bg-white/30 dark:bg-black/10 transition-colors">
          {children}
        </main>
      </div>

      {footer}
    </div>
  );
};

export default Layout;
