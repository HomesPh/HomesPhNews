import { Globe, Eye, Users, Clock, Share2, MousePointerClick } from 'lucide-react';
import { BloggerArticle } from '@/lib/api-v2/blogger/service/analytics/getBloggerAnalytics';

interface TopArticlesListProps {
    articles: BloggerArticle[];
}

export default function TopArticlesList({ articles }: TopArticlesListProps) {
    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827] mb-1">Top Performing Blogs</h3>
                <p className="text-sm text-gray-500">Your most successful content</p>
            </div>
            <div className="space-y-4">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="flex flex-col md:flex-row gap-4 p-5 border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
                    >
                        <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-full md:w-32 h-20 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                        <div className="flex-1">
                            <h4 className="font-semibold text-[#111827] mb-2 group-hover:text-[#C10007] transition-colors line-clamp-1">{article.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium border border-green-100">{article.status}</span>
                                <span className='hidden md:inline'>•</span>
                                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                                <span className='hidden md:inline'>•</span>
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {article.sites.slice(0, 2).join(', ')}{article.sites.length > 2 && ` +${article.sites.length - 2}`}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Eye className="w-3 h-3" /> Views</div>
                                    <div className="font-semibold text-gray-900">{article.views.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Visitors</div>
                                    <div className="font-semibold text-gray-900">{article.uniqueVisitors.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Avg. Read</div>
                                    <div className="font-semibold text-gray-900">{article.avgReadTime}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> Engage</div>
                                    <div className="font-semibold text-blue-600">{article.engagementRate}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
