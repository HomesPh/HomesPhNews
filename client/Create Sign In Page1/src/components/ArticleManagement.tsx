import { useState } from 'react';
import { Plus, Search, ChevronDown, Calendar, Eye } from 'lucide-react';
import { ArticleEditorModal } from './ArticleEditorModal';
import { Pagination } from './Pagination';
import imgImg1 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";
import svgPaths from "./imports/svg-moj9pt7tge";

interface ArticleManagementProps {
  sidebarCollapsed: boolean;
  onNavigate: (page: string, articleId?: number) => void;
}

export function ArticleManagement({ sidebarCollapsed, onNavigate }: ArticleManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Category');
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const mockArticles = [
    {
      id: 1,
      image: imgImg1,
      category: 'Technology',
      location: 'USA',
      title: 'AI Revolution: How Machine Learning is Transforming Healthcare in North America',
      description: 'Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.',
      date: 'January 14, 2026',
      views: '100 views',
      status: 'all',
      sites: ['Main Portal', 'Bayanihan']
    },
    {
      id: 2,
      image: imgImg1,
      category: 'Technology',
      location: 'USA',
      title: 'AI Revolution: How Machine Learning is Transforming Healthcare in North America',
      description: 'Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.',
      date: 'January 14, 2026',
      views: '100 views',
      status: 'all',
      sites: ['Main Portal', 'Bayanihan']
    },
    {
      id: 3,
      image: imgImg1,
      category: 'Technology',
      location: 'USA',
      title: 'AI Revolution: How Machine Learning is Transforming Healthcare in North America',
      description: 'Computer researchers develop groundbreaking AI system that can detect early signs of cancer with 98% accuracy, potentially saving thousands of lives annually.',
      date: 'January 14, 2026',
      views: '100 views',
      status: 'all',
      sites: ['Main Portal', 'Bayanihan']
    },
  ];

  const tabs = [
    { id: 'all' as const, label: 'All Articles', count: 8 },
    { id: 'published' as const, label: 'Published', count: 5 },
    { id: 'pending' as const, label: 'Pending Review', count: 3 },
    { id: 'rejected' as const, label: 'Rejected', count: 0 },
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
            Article Management
          </h1>
          <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
            Manage and review all articles across the platform
          </p>
        </div>
        <button 
          className="flex items-center gap-[10px] px-5 py-3 bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors h-[50px]" 
          onClick={() => setShowCreateModal(true)}
        >
          <svg className="w-[14px] h-[16px]" fill="none" viewBox="0 0 14 16">
            <path d={svgPaths.p2cd26500} fill="white" />
          </svg>
          <span className="text-[16px] font-medium tracking-[-0.5px]">New Article</span>
        </button>
      </div>

      {/* White Container */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb]">
        {/* Tabs */}
        <div className="border-b border-[#e5e7eb] pt-5 px-0">
          <div className="flex gap-8 px-5">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-[15px] px-2 pb-3 relative ${
                    isActive ? 'border-b-4 border-[#C10007]' : ''
                  }`}
                >
                  {/* Show checkmark icon for Published tab */}
                  {index === 1 && (
                    <svg className="w-[14px] h-[16px]" fill="none" viewBox="0 0 14 16">
                      <g clipPath="url(#clip0_1_708)">
                        <path d={svgPaths.p921bd00} fill={isActive ? '#C10007' : '#4B5563'} />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_708">
                          <path d="M0 0H14V16H0V0Z" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                  {/* Show clock icon for Pending Review tab */}
                  {index === 2 && (
                    <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 16 16">
                      <g clipPath="url(#clip0_1_711)">
                        <path d={svgPaths.p803d900} fill={isActive ? '#C10007' : '#4B5563'} />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_711">
                          <path d="M0 0H16V16H0V0Z" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                  {/* Show X icon for Rejected tab */}
                  {index === 3 && (
                    <svg className="w-[12px] h-[16px]" fill="none" viewBox="0 0 12 16">
                      <path d={svgPaths.pf5d1f80} fill={isActive ? '#C10007' : '#4B5563'} />
                    </svg>
                  )}
                  <span className={`text-[16px] tracking-[-0.5px] ${
                    isActive ? 'text-[#C10007] font-semibold' : 'text-[#4b5563] font-medium'
                  }`}>
                    {tab.label}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] ${
                      isActive
                        ? 'bg-[#C10007] text-white font-semibold'
                        : 'bg-[#e5e7eb] text-[#4b5563] font-medium'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 p-5 border-b border-[#e5e7eb]">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-[50px] pl-12 pr-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
            />
          </div>
          <div className="relative w-[159px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
            >
              <option>All Category</option>
              <option>Technology</option>
              <option>Politics</option>
              <option>Business</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
          </div>
          <div className="relative w-[163px]">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
            >
              <option>All Countries</option>
              <option>USA</option>
              <option>Singapore</option>
              <option>Philippines</option>
              <option>Europe</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
          </div>
        </div>

        {/* Articles List */}
        <div className="divide-y divide-[#e5e7eb]">
          {mockArticles.map((article) => (
            <div
              key={article.id}
              className="flex gap-[13px] p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onNavigate('article-details', article.id)}
            >
              {/* Thumbnail */}
              <img
                src={article.image}
                alt=""
                className="w-[118px] h-[106px] rounded-[8px] object-cover flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-h-[106px]">
                {/* Category and Location */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                    {article.category}
                  </span>
                  <span className="text-[14px] text-[#111827]">|</span>
                  <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                    {article.location}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-[#1f2937] leading-[32px] tracking-[-0.5px] mb-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#4b5563] leading-[normal] tracking-[-0.5px] mb-2">
                  {article.description}
                </p>

                {/* Date and Views */}
                <div className="flex items-center gap-2 text-[12px] text-[#6b7280] tracking-[-0.5px] mb-2">
                  <Calendar className="w-[11px] h-[12px]" />
                  <span className="leading-[20px]">{article.date}</span>
                  <span className="text-[16px]">•</span>
                  <span className="leading-[20px]">{article.views}</span>
                </div>

                {/* Published On */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6b7280] leading-[20px] tracking-[-0.5px]">Published on:</span>
                  {article.sites.map((site, idx) => (
                    <span
                      key={idx}
                      className="px-[14px] py-1 bg-[#f3f4f6] rounded-[4px] text-[12px] font-medium text-[#374151] tracking-[-0.5px]"
                    >
                      {site}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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