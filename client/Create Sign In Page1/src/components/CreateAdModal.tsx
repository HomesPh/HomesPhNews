import { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import svgPaths from "../imports/svg-yoepecf0hc";

interface CreateAdModalProps {
  onClose: () => void;
}

export function CreateAdModal({ onClose }: CreateAdModalProps) {
  const [formData, setFormData] = useState({
    adName: '',
    clientName: '',
    adSize: '300×250 (Rectangle)',
    adImage: '',
    imageUrl: '',
    targetUrl: '',
    placements: {
      newsPortalTop: true,
      newsPortalSidebar: false,
      newsPortalBottom: false,
      articlePagesBottom: false,
      articlePagesTop: false,
      articlePagesInFeed: false,
      sidebarAllPages: false,
      categoryPagesTop: false,
      homepageBanner: false,
      homepageSidebar: false
    },
    startDate: '',
    endDate: '',
    revenue: '',
    setAsActive: true
  });

  const handleCheckboxChange = (placement: keyof typeof formData.placements) => {
    setFormData({
      ...formData,
      placements: {
        ...formData.placements,
        [placement]: !formData.placements[placement]
      }
    });
  };

  const handleSubmit = () => {
    alert('Advertisement created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
              Create New Advertisement
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-8">
          <div className="space-y-6">
            {/* Ad Name / Campaign Title */}
            <div>
              <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Ad Name / Campaign Title
                <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.adName}
                onChange={(e) => setFormData({ ...formData, adName: e.target.value })}
                placeholder="Real Estate Expo 2026"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Client / Advertiser Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Client / Advertiser Name
                <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Dubai Property Developers"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Ad Size */}
            <div>
              <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Ad Size
                <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.adSize}
                  onChange={(e) => setFormData({ ...formData, adSize: e.target.value })}
                  className="w-full px-3 py-3 border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] appearance-none pr-10"
                >
                  <option>300×250 (Rectangle)</option>
                  <option>728×90 (Leaderboard)</option>
                  <option>160×600 (Skyscraper)</option>
                  <option>300×600 (Half Page)</option>
                  <option>970×250 (Billboard)</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 32 32">
                  <path d={svgPaths.pfd263c0} fill="black" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Ad Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Ad Image
                  <span className="text-[#ef4444]">*</span>
                </label>
                <button className="text-[14px] font-semibold text-[#3b82f6] hover:underline tracking-[-0.5px]">
                  Generate Image
                </button>
              </div>
              <div className="border-2 border-dashed border-[#d1d5db] rounded-[12px] bg-[#f9fafb] py-7 px-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[16px] font-medium text-[#374151] tracking-[-0.5px]">
                    Drag image here or click to browse
                  </p>
                  <svg className="w-[60px] h-[48px] mt-1 mb-1" fill="none" viewBox="0 0 60 48">
                    <path d={svgPaths.p334c8c00} fill="#9CA3AF" />
                  </svg>
                  <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                    Recommended: 300×250, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Or enter image URL */}
            <div>
              <label className="block text-[14px] font-light text-[#111827] mb-2 tracking-[-0.5px]">
                Or enter image URL:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/ad-image.jpg"
                  className="w-full px-3 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] pr-10"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 32 32">
                  <path d={svgPaths.pfd263c0} fill="black" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Target URL */}
            <div>
              <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Target URL
                <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://example.com/landing-page"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
              <p className="text-[12px] text-[#6b7280] mt-2 tracking-[-0.5px] leading-[16px]">
                Where users will be redirected when clicking the ad
              </p>
            </div>

            {/* Ad Placement */}
            <div>
              <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Ad Placement
                <span className="text-[#ef4444]">*</span>
              </label>
              <p className="text-[12px] text-[#6b7280] mb-2 tracking-[-0.5px] leading-[16px]">
                Select where this ad should appear (choose one or more)
              </p>
              <div className="bg-[#f9fafb] rounded-[12px] p-6">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.newsPortalTop}
                        onChange={() => handleCheckboxChange('newsPortalTop')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">News Portal - Top</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.newsPortalBottom}
                        onChange={() => handleCheckboxChange('newsPortalBottom')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">News Portal - Bottom</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.newsPortalSidebar}
                        onChange={() => handleCheckboxChange('newsPortalSidebar')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">News Portal - Sidebar</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.articlePagesTop}
                        onChange={() => handleCheckboxChange('articlePagesTop')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Article Pages - Top</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.articlePagesBottom}
                        onChange={() => handleCheckboxChange('articlePagesBottom')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Article Pages - Bottom</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.articlePagesInFeed}
                        onChange={() => handleCheckboxChange('articlePagesInFeed')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Article Pages - In-feed</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.sidebarAllPages}
                        onChange={() => handleCheckboxChange('sidebarAllPages')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Sidebar - All Pages</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.categoryPagesTop}
                        onChange={() => handleCheckboxChange('categoryPagesTop')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Category Pages - Top</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.homepageBanner}
                        onChange={() => handleCheckboxChange('homepageBanner')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Homepage - Banner</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative w-4 h-4">
                      <input
                        type="checkbox"
                        checked={formData.placements.homepageSidebar}
                        onChange={() => handleCheckboxChange('homepageSidebar')}
                        className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                      />
                      <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] text-[#111827] tracking-[-0.5px] leading-[24px]">Homepage - Sidebar</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Start Date
                  <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="mm/ dd / yyyy"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] pr-10"
                  />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p347fa80} stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  End Date
                  <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="mm/ dd / yyyy"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] pr-10"
                  />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p347fa80} stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Campaign Revenue */}
            <div>
              <label className="block text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Campaign Revenue (₱)
              </label>
              <input
                type="text"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
              <p className="text-[12px] text-[#6b7280] mt-2 tracking-[-0.5px] leading-[16px]">
                Expected or actual revenue from this ad campaign
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Set as Active */}
        <div className="px-8 py-8 border-t border-[#e5e7eb]">
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative w-4 h-4 mt-0.5">
                <input
                  type="checkbox"
                  checked={formData.setAsActive}
                  onChange={(e) => setFormData({ ...formData, setAsActive: e.target.checked })}
                  className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#C10007] checked:border-[#C10007] cursor-pointer"
                />
                <svg className="absolute inset-0 w-4 h-4 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 12 12">
                  <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[24px] block">
                  Set ad as active immediately
                </span>
                <p className="text-[12px] text-[#6b7280] tracking-[-0.5px] leading-[16px]">
                  Active ads will be displayed on selected placements
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e5e7eb]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[14px] font-medium tracking-[-0.5px]"
            >
              <span className="text-[20px] leading-none">+</span>
              Create Advertisement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}