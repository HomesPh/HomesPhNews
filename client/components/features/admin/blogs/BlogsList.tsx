"use client";

import { Calendar, Eye, Trash2 } from 'lucide-react';
import { AdminBlog } from "@/app/admin/users/data";
import { cn } from "@/lib/utils";

interface BlogsListProps {
    blogs: AdminBlog[];
    onView: (blogId: number) => void;
    onDelete: (blogId: number) => void;
}

export default function BlogsList({ blogs, onView, onDelete }: BlogsListProps) {
    return (
        <div className="divide-y divide-[#e5e7eb]">
            {blogs.map((blog) => (
                <div
                    key={blog.id}
                    className="flex gap-[20px] p-6 hover:bg-gray-50 transition-colors group relative border-b border-[#f3f4f6] last:border-0"
                >
                    {/* Thumbnail */}
                    <div
                        className="w-[200px] h-[140px] rounded-[12px] overflow-hidden flex-shrink-0 cursor-pointer shadow-sm border border-[#e5e7eb]"
                        onClick={() => onView(blog.id)}
                    >
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-1 cursor-pointer" onClick={() => onView(blog.id)}>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-[#fff5f5] border border-[#ffebeb] rounded-[6px] text-[12px] font-bold text-[#C10007] tracking-[-0.5px] uppercase">
                                    {blog.category}
                                </span>
                                <span className="text-[#e5e7eb]">|</span>
                                <span className="text-[14px] font-bold text-[#111827] tracking-[-0.5px]">
                                    by {blog.authorName}
                                </span>
                            </div>

                            <h3 className="text-[20px] font-bold text-[#111827] leading-[1.3] tracking-[-0.5px] mb-2 group-hover:text-[#C10007] transition-colors">
                                {blog.title}
                            </h3>

                            <p className="text-[14px] text-[#6b7280] leading-[1.5] tracking-[-0.5px] mb-4 line-clamp-2">
                                {blog.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[13px] text-[#9ca3af] font-medium tracking-[-0.5px]">
                                <Calendar className="w-4 h-4" />
                                <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-[#9ca3af] font-medium tracking-[-0.5px]">
                                <Eye className="w-4 h-4" />
                                <span>{blog.views.toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-[12px] text-[#9ca3af] tracking-[-0.5px]">Published on:</span>
                                <div className="flex gap-1.5">
                                    {blog.sites.map((site, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-[#374151] tracking-[-0.5px]"
                                        >
                                            {site}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions - shown on hover */}
                    <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(blog.id);
                            }}
                            className="p-2.5 bg-white border border-[#e5e7eb] hover:bg-blue-50 hover:border-blue-200 rounded-[10px] transition-all shadow-sm group/btn"
                            title="View Blog"
                        >
                            <Eye className="w-5 h-5 text-[#6b7280] group-hover/btn:text-blue-600" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(blog.id);
                            }}
                            className="p-2.5 bg-white border border-[#e5e7eb] hover:bg-red-50 hover:border-red-200 rounded-[10px] transition-all shadow-sm group/btn"
                            title="Delete Blog"
                        >
                            <Trash2 className="w-5 h-5 text-[#6b7280] group-hover/btn:text-red-600" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
