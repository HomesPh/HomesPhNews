import { useState } from 'react';
import { Eye, Users, MousePointerClick, TrendingUp, ChevronDown, Download, Calendar } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  sidebarCollapsed: boolean;
}

export function Analytics({ sidebarCollapsed }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [exportFormat, setExportFormat] = useState('CSV');

  // Traffic Trends Data
  const trafficData = [
    { month: 'Jan', pageViews: 350000, visitors: 120000 },
    { month: 'Feb', pageViews: 380000, visitors: 135000 },
    { month: 'Mar', pageViews: 420000, visitors: 155000 },
    { month: 'Apr', pageViews: 460000, visitors: 165000 },
    { month: 'May', pageViews: 480000, visitors: 170000 },
    { month: 'Jun', pageViews: 520000, visitors: 180000 },
    { month: 'Jul', pageViews: 550000, visitors: 190000 },
    { month: 'Aug', pageViews: 580000, visitors: 195000 },
    { month: 'Sep', pageViews: 600000, visitors: 200000 },
    { month: 'Oct', pageViews: 630000, visitors: 205000 },
    { month: 'Nov', pageViews: 650000, visitors: 210000 },
    { month: 'Dec', pageViews: 680000, visitors: 220000 },
  ];

  // Content by Category Data
  const categoryData = [
    { name: 'Real Estate', value: 32, color: '#3B82F6' },
    { name: 'Business', value: 24, color: '#8B5CF6' },
    { name: 'Technology', value: 18, color: '#10B981' },
    { name: 'Economy', value: 14, color: '#F59E0B' },
    { name: 'Politics', value: 8, color: '#EF4444' },
    { name: 'Tourism', value: 4, color: '#EC4899' },
  ];

  // Performance by Country Data
  const countryData = [
    { country: 'Philippines', articlesPublished: 120, totalViews: 1200000 },
    { country: 'UAE', articlesPublished: 85, totalViews: 950000 },
    { country: 'Singapore', articlesPublished: 72, totalViews: 780000 },
    { country: 'USA', articlesPublished: 65, totalViews: 720000 },
    { country: 'Canada', articlesPublished: 48, totalViews: 580000 },
    { country: 'Others', articlesPublished: 35, totalViews: 420000 },
  ];

  // Partner Sites Performance Data
  const partnerSitesData = [
    { site: 'FilipinoHomes', articlesShared: 145, monthlyViews: 250000, revenueGenerated: '$12,500', avgEngagement: '1.7K' },
    { site: 'Rent.ph', articlesShared: 234, monthlyViews: 450000, revenueGenerated: '$22,000', avgEngagement: '1.9K' },
    { site: 'Homes', articlesShared: 87, monthlyViews: 180000, revenueGenerated: '$8,500', avgEngagement: '2.3K' },
    { site: 'Bayanihan', articlesShared: 156, monthlyViews: 320000, revenueGenerated: '$15,000', avgEngagement: '2.1K' },
  ];

  const totalArticlesShared = partnerSitesData.reduce((sum, site) => sum + site.articlesShared, 0);
  const totalMonthlyViews = partnerSitesData.reduce((sum, site) => sum + site.monthlyViews, 0);
  const totalRevenue = partnerSitesData.reduce((sum, site) => {
    const amount = parseFloat(site.revenueGenerated.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  const handleExportData = () => {
    if (exportFormat === 'CSV') {
      // Create CSV content
      let csv = 'Metric,Value\n';
      csv += 'Total Page Views,4.7M\n';
      csv += 'Unique Visitors,1477K\n';
      csv += 'Total Clicks,264K\n';
      csv += 'Avg Engagement,5.65%\n';
      csv += '\nCategory,Percentage\n';
      categoryData.forEach(cat => {
        csv += `${cat.name},${cat.value}%\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${dateRange.toLowerCase().replace(/\s+/g, '-')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (exportFormat === 'PDF') {
      alert('PDF export would be implemented here');
    } else if (exportFormat === 'Excel') {
      alert('Excel export would be implemented here');
    }
  };

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
            Analytics Dashboard
          </h1>
          <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
            Track performance metrics and insights across all platforms
          </p>
        </div>

        {/* Filter and Export Controls */}
        <div className="flex items-center gap-4">
          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>Custom Range</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
          </div>

          {/* Export Format Filter */}
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
            >
              <option>CSV</option>
              <option>PDF</option>
              <option>Excel</option>
              <option>JSON</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
          </div>

          {/* Export Data Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-5 h-[50px] bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-[16px] font-medium tracking-[-0.5px]">Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Page Views */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Total Page Views</p>
            <Eye className="w-[20px] h-[18px] text-[#155DFC]" />
          </div>
          <p className="text-[38px] font-bold text-[#111827] tracking-[-0.5px] mb-3">4.7M</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <p className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+15.3% from last period</p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Unique Visitors</p>
            <Users className="w-[22px] h-[18px] text-[#9810FA]" />
          </div>
          <p className="text-[38px] font-bold text-[#111827] tracking-[-0.5px] mb-3">1477K</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <p className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+12.8% from last period</p>
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Total Clicks</p>
            <MousePointerClick className="w-[18px] h-[18px] text-[#10B981]" />
          </div>
          <p className="text-[38px] font-bold text-[#111827] tracking-[-0.5px] mb-3">264K</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <p className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+16.5% from last period</p>
          </div>
        </div>

        {/* Avg Engagement */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">Avg Engagement</p>
            <TrendingUp className="w-[18px] h-[18px] text-[#F97316]" />
          </div>
          <p className="text-[38px] font-bold text-[#111827] tracking-[-0.5px] mb-3">5.65%</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <p className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">+2.3% from last period</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Traffic Trends */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Traffic Trends</h3>
            <Calendar className="w-5 h-5 text-[#9ca3af]" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Page Views"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Visitors"
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content by Category */}
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Content by Category</h3>
            <div className="w-5 h-5 rounded-full bg-[#f3f4f6]" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                formatter={(value: any) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance by Country */}
      <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Performance by Country</h3>
          <div className="w-5 h-5 rounded-full bg-[#f3f4f6]" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="country" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#e5e7eb"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#e5e7eb"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#e5e7eb"
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'Total Views') {
                  return value.toLocaleString();
                }
                return value;
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="articlesPublished" 
              fill="#3b82f6" 
              name="Articles Published"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="right"
              dataKey="totalViews" 
              fill="#10b981" 
              name="Total Views"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Partner Sites Performance */}
      <div className="bg-white border border-[#f3f4f6] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="p-6 border-b border-[#f3f4f6]">
          <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Partner Sites Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Partner Site
                </th>
                <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Articles Shared
                </th>
                <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Monthly Views
                </th>
                <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Revenue Generated
                </th>
                <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#111827] tracking-[-0.5px]">
                  Avg Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              {partnerSitesData.map((site, index) => (
                <tr key={index} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                  <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                    {site.site}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                    {site.articlesShared}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                    {site.monthlyViews.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">
                    {site.revenueGenerated}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                    {site.avgEngagement}
                  </td>
                </tr>
              ))}
              <tr className="bg-[#f9fafb] font-semibold">
                <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                  Total
                </td>
                <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                  {totalArticlesShared}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                  {totalMonthlyViews.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">
                  ${totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#111827] tracking-[-0.5px]">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
