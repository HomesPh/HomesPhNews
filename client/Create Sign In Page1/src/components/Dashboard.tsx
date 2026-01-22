import { useState } from 'react';
import {
  FileText,
  BarChart3,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ArticleEditorModal } from './ArticleEditorModal';
import imgImg1 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";
import imgImg2 from "figma:asset/c84bca73046c8f3c7314a1ed5802acea60687588.png";
import imgImg3 from "figma:asset/64c04c8966fc1f6082ba2016172bbd81c37aaa97.png";
import imgImg4 from "figma:asset/3a1fcc6d1ca539dce00a1745d4a8cb7bf2744c97.png";

interface DashboardProps {
  onSignOut: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Dashboard({ onSignOut, currentPage, onNavigate }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const articles = [
    {
      id: 1,
      image: imgImg1,
      category: 'Technology',
      location: 'USA',
      title: 'Self-Driving Cars Get Federal Approval: What This Means for the Future',
      date: 'January 14, 2026',
      views: '100 views'
    },
    {
      id: 2,
      image: imgImg2,
      category: 'Technology',
      location: 'SINGAPORE',
      title: "Singapore Launches World's First AI-Powered Urban Management System",
      date: 'January 14, 2026',
      views: '100 views'
    },
    {
      id: 3,
      image: imgImg3,
      category: 'Politics',
      location: 'EUROPE',
      title: 'EU Passes Landmark AI Ethics Legislation: Tech Giants Face New Restrictions',
      date: 'January 14, 2026',
      views: '100 views'
    },
    {
      id: 4,
      image: imgImg4,
      category: 'Business',
      location: 'PHILIPPINES',
      title: "Philippines Emerges as Southeast Asia's AI Outsourcing Leader",
      date: 'January 14, 2026',
      views: '100 views'
    },
    {
      id: 5,
      image: imgImg4,
      category: 'Business',
      location: 'PHILIPPINES',
      title: "Philippines Emerges as Southeast Asia's AI Outsourcing Leader",
      date: 'January 14, 2026',
      views: '100 views'
    }
  ];

  const sites = [
    { name: 'Main Portal', count: 5 },
    { name: 'Filipino Homes', count: 6 },
    { name: 'Rent.ph', count: 8 },
    { name: 'HomesPh', count: 7 },
    { name: 'Bayanihan', count: 6 }
  ];

  return (
    <div className="p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">Dashboard</h1>
        <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
          Welcome back, John. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Articles */}
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Total Articles</p>
            <div className="w-[24px] h-[24px] bg-[#dbeafe] rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#155DFC]" />
            </div>
          </div>
          <p className="text-[38px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">8</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+15.3%</span>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#4b5563] tracking-[-0.5px]">Published</p>
            <CheckCircle2 className="w-[18px] h-[18px] text-[#10b981]" />
          </div>
          <p className="text-[36px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">6</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+12.8%</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#4b5563] tracking-[-0.5px]">Pending Review</p>
            <AlertCircle className="w-[18px] h-[18px] text-[#F59E0B]" />
          </div>
          <p className="text-[36px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">10</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+18.5%</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Total Views</p>
            <Eye className="w-[20px] h-[18px] text-[#A13DE4]" />
          </div>
          <p className="text-[36px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">89.2K</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+2.3%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Recent Articles</h2>
            <button
              onClick={() => onNavigate('articles')}
              className="text-[14px] font-semibold text-[#C10007] hover:text-[#a10006] tracking-[-0.5px]"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-[8px] border border-[#f3f4f6] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={article.image}
                    alt=""
                    className="w-[80px] h-[80px] rounded-[8px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                        {article.category}
                      </span>
                      <span className="text-[14px] text-[#111827]">|</span>
                      <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                        {article.location}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#111827] leading-[28px] tracking-[-0.5px] mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[14px] text-[#6b7280] tracking-[-0.5px]">
                      <Calendar className="w-[12px] h-[13.333px]" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Article Distribution */}
          <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-[18px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">Article Distribution</h2>
            <div className="space-y-4">
              {sites.map((site, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] text-[#111827] tracking-[-0.5px]">{site.name}</span>
                    <span className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">
                      {site.count} articles
                    </span>
                  </div>
                  <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#C10007] rounded-full"
                      style={{ width: `${(site.count / 8) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            <h2 className="text-[18px] font-bold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('articles')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#111827]" />
                <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">
                  Manage Articles
                </span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#111827]" />
                <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">
                  Create New Article
                </span>
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-[#111827]" />
                <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">View Analytics</span>
              </button>
              <button
                onClick={() => onNavigate('calendar')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] hover:bg-[#f9fafb] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#111827]" />
                <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">Schedule Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Article Modal */}
      {showCreateModal && (
        <ArticleEditorModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}