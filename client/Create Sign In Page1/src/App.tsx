import { useState } from 'react';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';
import { ArticleManagement } from './components/ArticleManagement';
import { ArticleDetails } from './components/ArticleDetails';
import { Analytics } from './components/Analytics';
import { AdsManagement } from './components/AdsManagement';
import { SitesManagement } from './components/SitesManagement';
import { EventCalendar } from './components/EventCalendar';
import { Settings } from './components/Settings';
import svgPaths from "./imports/svg-8jkdqq9m6p";
import imgImg from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Globe,
  Calendar,
  LogOut,
  Menu,
  Settings as SettingsIcon,
} from 'lucide-react';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<number | undefined>(undefined);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string, articleId?: number) => {
    setCurrentPage(page);
    if (articleId !== undefined) {
      setCurrentArticleId(articleId);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sites', label: 'Sites', icon: Globe },
    { id: 'ads', label: 'Ads', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (!isSignedIn) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <div className="font-['Inter',sans-serif]">
      <div className="min-h-screen bg-[#f9fafb] flex">
        {/* Sidebar */}
        <aside
          className={`bg-[#1a1d2e] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10 transition-all duration-300 ${
            sidebarCollapsed ? 'w-[80px]' : 'w-[240px]'
          }`}
        >
          {/* Logo */}
          <div className="px-4 py-6 border-b border-[rgba(255,255,255,0.1)]">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 px-2">
                <div className="w-[40px] h-[40px] bg-[#C10007] rounded-[8px] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g clipPath="url(#clip0_logo)">
                      <path d={svgPaths.p1c7a5700} fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_logo">
                        <path d="M0 0H20V20H0V0Z" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-[20px] font-bold text-white leading-[1.4] tracking-[-0.5px]">Global News</h1>
                  <p className="text-[12px] font-normal text-[#9ca3af] leading-[1.3] tracking-[-0.5px]">Network</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-[40px] h-[40px] bg-[#C10007] rounded-[8px] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g clipPath="url(#clip0_logo_collapsed)">
                      <path d={svgPaths.p1c7a5700} fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_logo_collapsed">
                        <path d="M0 0H20V20H0V0Z" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full ${
                        isActive
                          ? 'bg-[#C10007] text-white'
                          : 'text-[#9ca3af] hover:bg-[#252836] hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-[14px] font-medium tracking-[-0.5px]">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-[#2a2d3e]">
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#252836] hover:text-white rounded-[8px] transition-colors w-full ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-[14px] font-medium tracking-[-0.5px]">Logout</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}
        >
          {/* Header */}
          <header className="bg-white border-b border-[#f3f4f6] px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-[#1E1E1E]" />
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[16px] font-medium text-[#111827] tracking-[-0.5px]">John Smith</p>
                  <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Admin</p>
                </div>
                <img
                  src={imgImg}
                  alt="Profile"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          {currentPage === 'dashboard' && (
            <Dashboard
              onSignOut={handleSignOut}
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'articles' && <ArticleManagement sidebarCollapsed={sidebarCollapsed} onNavigate={handleNavigate} />}
          {currentPage === 'article-details' && <ArticleDetails articleId={currentArticleId} onNavigate={handleNavigate} />}
          {currentPage === 'analytics' && <Analytics sidebarCollapsed={sidebarCollapsed} />}
          {currentPage === 'ads' && <AdsManagement sidebarCollapsed={sidebarCollapsed} onNavigate={handleNavigate} />}
          {currentPage === 'sites' && <SitesManagement sidebarCollapsed={sidebarCollapsed} onNavigate={handleNavigate} />}
          {currentPage === 'calendar' && <EventCalendar sidebarCollapsed={sidebarCollapsed} onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <Settings sidebarCollapsed={sidebarCollapsed} onNavigate={handleNavigate} />}
          {currentPage !== 'dashboard' && currentPage !== 'articles' && currentPage !== 'article-details' && currentPage !== 'analytics' && currentPage !== 'ads' && currentPage !== 'sites' && currentPage !== 'calendar' && currentPage !== 'settings' && (
            <div className="p-8">
              <div className="bg-white rounded-[12px] border border-[#f3f4f6] p-12 text-center">
                <h2 className="text-[24px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                  {navItems.find(item => item.id === currentPage)?.label || 'Page'}
                </h2>
                <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                  This page is under construction.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}