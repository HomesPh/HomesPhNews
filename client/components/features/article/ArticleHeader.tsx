"use client";

import { Eye, Calendar } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaShareAlt } from "react-icons/fa";
import Link from "next/link";

interface ArticleHeaderProps {
  category: string;
  location: string;
  title: string;
  subtitle: string;
  author: {
    name: string;
    image?: string; // Optional for now
  };
  date: string;
  views: number;
}

export default function ArticleHeader({
  category,
  location,
  title,
  subtitle,
  author,
  date,
  views,
}: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      {/* Category | Location */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-4">
        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{category}</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-900">{location}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-600 mb-6 font-light">
        {subtitle}
      </p>

      {/* Metadata & Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-gray-200 py-4 gap-4">

        {/* Author & Date */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">By {author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>
        </div>

        {/* Social Share */}
        <div className="flex items-center gap-4">
          <Link href="#" className="text-gray-400 hover:text-[#1877F2] transition-colors"><FaFacebookF /></Link>
          <Link href="#" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><FaTwitter /></Link>
          <Link href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors"><FaLinkedinIn /></Link>
          <Link href="#" className="text-gray-400 hover:text-gray-700 transition-colors"><FaShareAlt /></Link>
        </div>

      </div>
    </header>
  );
}
