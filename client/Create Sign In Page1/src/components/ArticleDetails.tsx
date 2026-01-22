import { useState } from 'react';
import { Calendar, Eye, Edit, XCircle } from 'lucide-react';
import { ArticleEditorModal } from './ArticleEditorModal';
import { CustomizeTitlesModal } from './CustomizeTitlesModal';
import imgArticle from "figma:asset/bec21fc75386a86210d32bec8ca98fcb2380d21e.png";

interface ArticleDetailsProps {
  articleId: number;
  onNavigate: (page: string) => void;
}

export function ArticleDetails({ articleId, onNavigate }: ArticleDetailsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [publishToSites, setPublishToSites] = useState({
    filipinoHomes: true,
    rentPh: true,
    homes: false,
    bayanihan: false,
    mainPortal: true,
  });

  const toggleSite = (site: keyof typeof publishToSites) => {
    setPublishToSites(prev => ({ ...prev, [site]: !prev[site] }));
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => onNavigate('article-management')}
          className="text-[14px] text-[#6b7280] hover:text-[#C10007] transition-colors tracking-[-0.5px]"
        >
          Articles
        </button>
        <span className="text-[14px] text-[#6b7280]">/</span>
        <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Details</span>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8">
            {/* Category and Location */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white border border-[#e5e7eb] rounded-[4px] text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                Technology
              </span>
              <span className="text-[14px] text-[#111827]">|</span>
              <span className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px]">
                SINGAPORE
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[32px] font-bold text-[#111827] leading-[44px] tracking-[-0.5px] mb-3">
              Singapore Unveils First AI-Powered Urban Management System
            </h1>

            {/* Description */}
            <p className="text-[16px] text-[#6b7280] leading-[24px] tracking-[-0.5px] mb-6">
              The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 mb-6 text-[14px] text-[#6b7280] tracking-[-0.5px]">
              <span>By Author</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>January 14, 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>100 views</span>
              </div>
            </div>

            {/* Article Image */}
            <img
              src={imgArticle}
              alt="Singapore Urban Management"
              className="w-full h-auto rounded-[8px] mb-6"
            />

            {/* Article Body */}
            <div className="space-y-4 text-[16px] text-[#374151] leading-[28px] tracking-[-0.5px]">
              <p>
                The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.
              </p>
              
              <p>
                Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network.
              </p>
              
              <p>
                Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.
              </p>
              
              <p>
                The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.
              </p>
              
              <p>
                Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network.
              </p>
              
              <p>
                Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.
              </p>
            </div>

            {/* Topics */}
            <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
              <p className="text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">Topics:</p>
              <div className="flex flex-wrap gap-2">
                {['Singapore', 'smart city', 'urban management', 'AI technology'].map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#f3f4f6] rounded-[4px] text-[12px] text-[#374151] tracking-[-0.5px]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] space-y-6">
          {/* Publish Section */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
              Publish to:
            </h3>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToSites.filipinoHomes}
                  onChange={() => toggleSite('filipinoHomes')}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0"
                />
                <span className="text-[14px] text-[#374151] tracking-[-0.5px]">FilipinoHomes</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToSites.rentPh}
                  onChange={() => toggleSite('rentPh')}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0"
                />
                <span className="text-[14px] text-[#374151] tracking-[-0.5px]">Rent.ph</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToSites.homes}
                  onChange={() => toggleSite('homes')}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0"
                />
                <span className="text-[14px] text-[#374151] tracking-[-0.5px]">Homes</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToSites.bayanihan}
                  onChange={() => toggleSite('bayanihan')}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0"
                />
                <span className="text-[14px] text-[#374151] tracking-[-0.5px]">Bayanihan</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publishToSites.mainPortal}
                  onChange={() => toggleSite('mainPortal')}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0"
                />
                <span className="text-[14px] text-[#374151] tracking-[-0.5px]">Main News Portal</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowCustomizeModal(true)}
                className="flex-1 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-colors tracking-[-0.5px]">
                Customize
              </button>
              <button className="flex-1 px-4 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#2563eb] transition-colors tracking-[-0.5px]">
                Publish
              </button>
            </div>
          </div>

          {/* Article Statistics */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
              Article Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#6b7280]" />
                  <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Total Views</span>
                </div>
                <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">1,923</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 16 16">
                    <rect width="16" height="16" fill="none" />
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="8" cy="8" r="2" fill="currentColor" />
                  </svg>
                  <span className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Published Sites</span>
                </div>
                <span className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-colors tracking-[-0.5px]"
              >
                <Edit className="w-4 h-4" />
                Edit Article
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-colors tracking-[-0.5px]">
                <XCircle className="w-4 h-4" />
                Reject Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Article Modal */}
      {showEditModal && (
        <ArticleEditorModal
          mode="edit"
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Customize Titles Modal */}
      {showCustomizeModal && (
        <CustomizeTitlesModal
          onClose={() => setShowCustomizeModal(false)}
          publishTo={{
            filipinoHomes: publishToSites.filipinoHomes,
            rentPh: publishToSites.rentPh,
            homes: publishToSites.homes,
            bayanihan: publishToSites.bayanihan,
            mainNewsPortal: publishToSites.mainPortal,
          }}
          originalTitle="Singapore Unveils First AI-Powered Urban Management System"
        />
      )}
    </div>
  );
}