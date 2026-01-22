import { useState } from 'react';
import { Plus, Search, DollarSign, Eye, MousePointerClick, SquareStack, TrendingUp, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { CreateAdModal } from './CreateAdModal';
import { Pagination } from './Pagination';
import imgImg1 from "figma:asset/c84bca73046c8f3c7314a1ed5802acea60687588.png";
import imgImg2 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";

interface AdsManagementProps {
  sidebarCollapsed: boolean;
  onNavigate: (page: string) => void;
}

export function AdsManagement({ sidebarCollapsed, onNavigate }: AdsManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const mockAds = [
    {
      id: 1,
      title: 'Real Estate Expo 2026',
      status: 'Active',
      image: imgImg1,
      client: 'Dubai Property Developers',
      type: 'Leaderboard (728×90)',
      placement: 'News Portal - Top',
      articlePages: 'Article Pages - Top',
      revenue: '$15,000',
      impressions: '245,000',
      clicks: '3,420',
      period: '2026-01-01 to 2026-03-31'
    },
    {
      id: 2,
      title: 'AI Business Summit',
      status: 'Active',
      image: imgImg1,
      client: 'Tech Conference Inc',
      type: 'Rectangle (300×250)',
      placement: 'Sidebar - All Pages',
      articlePages: 'Article Pages - In-feed',
      revenue: '$8,500',
      impressions: '180,000',
      clicks: '2,150',
      period: '2026-01-15 to 2026-06-30'
    },
    {
      id: 3,
      title: 'Tourism Philippines Campaign',
      status: 'Inactive',
      image: imgImg2,
      client: 'Dubai Property Developers',
      type: 'Leaderboard (728×90)',
      placement: 'News Portal - Top',
      articlePages: 'Article Pages - Top',
      revenue: '$15,000',
      impressions: '245,000',
      clicks: '3,420',
      period: '2026-01-01 to 2026-03-31'
    }
  ];

  const filteredAds = mockAds.filter(ad => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && ad.status === 'Active') ||
                       (activeTab === 'inactive' && ad.status === 'Inactive');
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeAds = mockAds.filter(ad => ad.status === 'Active').length;
  const inactiveAds = mockAds.filter(ad => ad.status === 'Inactive').length;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
            Ads Management
          </h1>
          <p className="text-[14px] text-[#6b7280] mt-1 tracking-[-0.5px] leading-[20px]">
            Manage advertisements across all platforms
          </p>
        </div>

        {/* Create New Ad Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[16px] font-medium tracking-[-0.5px]">Create New Ad</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">$60,500</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
            <p className="text-[13px] font-semibold text-[#10b981] tracking-[-0.5px]">+15.3% from last month</p>
          </div>
        </div>

        {/* Active Ads */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Active Ads</p>
            <ToggleRight className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">{activeAds}</p>
          <p className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Out of {mockAds.length} total</p>
        </div>

        {/* Total Impressions */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Total Impressions</p>
            <Eye className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">940,000</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
            <p className="text-[13px] font-semibold text-[#10b981] tracking-[-0.5px]">+8% this week</p>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Total Clicks</p>
            <SquareStack className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">13,260</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
            <p className="text-[13px] font-semibold text-[#10b981] tracking-[-0.5px]">+8% this week</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 mb-6">
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Search - spans full width */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ads or clients..."
              className="w-full pl-11 pr-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px]"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#C10007] text-white'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              All ({mockAds.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${
                activeTab === 'active'
                  ? 'bg-[#C10007] text-white'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              Active ({activeAds})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${
                activeTab === 'inactive'
                  ? 'bg-[#C10007] text-white'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              Inactive ({inactiveAds})
            </button>
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-6">
              {/* Ad Image */}
              <div className="w-[120px] h-[90px] rounded-[8px] overflow-hidden flex-shrink-0">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              </div>

              {/* Ad Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                        {ad.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium tracking-[-0.5px] ${
                        ad.status === 'Active' 
                          ? 'bg-[#d1fae5] text-[#065f46]' 
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {ad.status}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-1">
                      <span className="font-medium">Client:</span> {ad.client} | <span className="font-medium">Type:</span> {ad.type}
                    </p>
                  </div>
                </div>

                {/* Ad Placement */}
                <div className="flex items-center gap-6 mb-3">
                  <div>
                    <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Ad Placement: </span>
                    <span className="text-[13px] font-medium text-[#111827] tracking-[-0.5px]">{ad.placement}</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-medium text-[#111827] tracking-[-0.5px]">{ad.articlePages}</span>
                  </div>
                </div>

                {/* Ad Stats */}
                <div className="flex items-center gap-8 text-[13px] tracking-[-0.5px]">
                  <div>
                    <span className="text-[#6b7280]">Revenue: </span>
                    <span className="font-semibold text-[#10b981]">{ad.revenue}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Impressions: </span>
                    <span className="font-medium text-[#111827]">{ad.impressions}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Clicks: </span>
                    <span className="font-medium text-[#111827]">{ad.clicks}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Period: </span>
                    <span className="font-medium text-[#111827]">{ad.period}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Toggle Status"
                >
                  {ad.status === 'Active' ? (
                    <ToggleRight className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-[#6b7280]" />
                  )}
                </button>
                <button
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-[#3b82f6]" />
                </button>
                <button
                  className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-[#ef4444]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <CreateAdModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}