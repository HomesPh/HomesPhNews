import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Link as LinkIcon, Users, Edit, Trash2 } from 'lucide-react';
import { AddPartnerSiteModal } from './AddPartnerSiteModal';
import { EditPartnerSiteModal } from './EditPartnerSiteModal';
import { Pagination } from './Pagination';
import imgImg1 from "figma:asset/c84bca73046c8f3c7314a1ed5802acea60687588.png";
import imgImg2 from "figma:asset/5dd8bf25056a2e777c434d97dc8134d7968b5a17.png";

interface SitesManagementProps {
  sidebarCollapsed: boolean;
  onNavigate: (page: string) => void;
}

interface Site {
  id: number;
  name: string;
  domain: string;
  status: 'Active' | 'Suspended';
  image: string;
  contact: string;
  description: string;
  categories: string[];
  requested: string;
  articles: number;
  monthlyViews: string;
}

export function SitesManagement({ sidebarCollapsed, onNavigate }: SitesManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [sites, setSites] = useState<Site[]>([
    {
      id: 1,
      name: 'FilipinoHomes',
      domain: 'filipinohomes.com',
      status: 'Active',
      image: imgImg1,
      contact: 'Name (name@filipinohomes.com)',
      description: 'Premier Philippine real estate platform focusing on properties for Filipino families.',
      categories: ['Real Estate', 'Business'],
      requested: '2025-11-15',
      articles: 145,
      monthlyViews: '250,000'
    },
    {
      id: 2,
      name: 'Rent.ph',
      domain: 'rent.ph',
      status: 'Active',
      image: imgImg1,
      contact: 'Name (name@rent.ph)',
      description: 'Leading property rental and investment platform in the Philippines.',
      categories: ['Real Estate', 'Business', 'Economy'],
      requested: '2025-11-15',
      articles: 234,
      monthlyViews: '450,000'
    },
    {
      id: 3,
      name: 'Bayanihan',
      domain: 'bayanihan.com',
      status: 'Active',
      image: imgImg2,
      contact: 'Name (name@bayanihan.com)',
      description: 'Connects Filipino communities worldwide by showcasing local events, restaurants, festivals, and cultural stories',
      categories: ['Real Estate', 'Business', 'Economy'],
      requested: '2025-11-15',
      articles: 234,
      monthlyViews: '450,000'
    }
  ]);

  const handleSuspend = (siteId: number) => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      const action = site.status === 'Active' ? 'suspend' : 'activate';
      if (confirm(`Are you sure you want to ${action} ${site.name}?`)) {
        setSites(sites.map(s => 
          s.id === siteId 
            ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' }
            : s
        ));
      }
    }
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedSite: Site) => {
    setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
  };

  const handleDelete = (siteId: number) => {
    const site = sites.find(s => s.id === siteId);
    if (site && confirm(`Are you sure you want to delete ${site.name}? This action cannot be undone.`)) {
      setSites(sites.filter(s => s.id !== siteId));
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && site.status === 'Active') ||
                       (activeTab === 'suspended' && site.status === 'Suspended');
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeSites = sites.filter(site => site.status === 'Active').length;
  const suspendedSites = sites.filter(site => site.status === 'Suspended').length;

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
            Sites Management
          </h1>
          <p className="text-[14px] text-[#6b7280] mt-1 tracking-[-0.5px] leading-[20px]">
            Manage partner sites and syndication connections
          </p>
        </div>

        {/* Add Partner Site Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[16px] font-medium tracking-[-0.5px]">Add Partner Site</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Active Partners */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Active Partners</p>
            <CheckCircle className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">{activeSites}</p>
          <p className="text-[13px] font-medium text-[#10b981] tracking-[-0.5px]">Connected & Publishing</p>
        </div>

        {/* Suspended */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Suspended</p>
            <XCircle className="w-5 h-5 text-[#ef4444]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">{suspendedSites}</p>
          <p className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Temporarily Inactive</p>
        </div>

        {/* Total Articles Shared */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Total Articles Shared</p>
            <LinkIcon className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">622</p>
          <p className="text-[13px] font-medium text-[#10b981] tracking-[-0.5px]">Across all partners</p>
        </div>

        {/* Total Monthly Reach */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[14px] font-medium text-[#6b7280] tracking-[-0.5px]">Total Monthly Reach</p>
            <Users className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <p className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mb-2">1.2M</p>
          <p className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Combined views/month</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 mb-6">
        <div className="flex items-center justify-between gap-6">
          {/* Search - spans full width */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sites, domains, or contacts..."
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
              All Sites ({sites.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${
                activeTab === 'active'
                  ? 'bg-[#C10007] text-white'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              Active ({activeSites})
            </button>
            <button
              onClick={() => setActiveTab('suspended')}
              className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${
                activeTab === 'suspended'
                  ? 'bg-[#C10007] text-white'
                  : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
              }`}
            >
              Suspended ({suspendedSites})
            </button>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="space-y-4">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-6">
              {/* Site Logo */}
              <div className="w-[100px] h-[100px] rounded-[8px] overflow-hidden flex-shrink-0">
                <img src={site.image} alt={site.name} className="w-full h-full object-cover" />
              </div>

              {/* Site Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                        {site.name}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium tracking-[-0.5px] ${
                        site.status === 'Active' 
                          ? 'bg-[#d1fae5] text-[#065f46]' 
                          : 'bg-[#fee2e2] text-[#991b1b]'
                      }`}>
                        {site.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                      <a href={`https://${site.domain}`} className="text-[13px] text-[#3b82f6] hover:underline tracking-[-0.5px]">
                        {site.domain}
                      </a>
                      <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">
                        Contact: {site.contact}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-3 leading-relaxed">
                      {site.description}
                    </p>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Categories:</span>
                  {site.categories.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#f3f4f6] text-[#374151] rounded-[4px] text-[12px] tracking-[-0.5px]"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Site Stats */}
                <div className="flex items-center gap-8 text-[13px] tracking-[-0.5px]">
                  <div>
                    <span className="text-[#6b7280]">Requested: </span>
                    <span className="font-medium text-[#111827]">{site.requested}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Articles: </span>
                    <span className="font-medium text-[#111827]">{site.articles}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Monthly Views: </span>
                    <span className="font-medium text-[#111827]">{site.monthlyViews}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleSuspend(site.id)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-[6px] transition-colors tracking-[-0.5px] ${
                    site.status === 'Active'
                      ? 'text-[#C10007] hover:bg-red-50'
                      : 'text-[#10b981] hover:bg-green-50'
                  }`}
                >
                  {site.status === 'Active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(site)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-[#3b82f6]" />
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
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

      {/* Add Partner Site Modal */}
      {showAddModal && (
        <AddPartnerSiteModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Partner Site Modal */}
      {showEditModal && editingSite && (
        <EditPartnerSiteModal
          site={editingSite}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}