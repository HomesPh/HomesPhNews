import { useState } from 'react';
import { X, Upload, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, Image as ImageIcon, Link, RotateCcw, RotateCw, Maximize, Info } from 'lucide-react';
import imgImage2 from "figma:asset/292c1d179a96fee18e347887f2a9f5ac3898537b.png";

interface ArticleEditorModalProps {
  mode: 'create' | 'edit';
  onClose: () => void;
  initialData?: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    country: string;
    tags: string[];
    author: string;
    publishDate: string;
    publishTime: string;
    publishTo: {
      filipinoHomes: boolean;
      rentPh: boolean;
      homes: boolean;
      bayanihan: boolean;
      mainNewsPortal: boolean;
    };
  };
}

export function ArticleEditorModal({ mode, onClose, initialData }: ArticleEditorModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [country, setCountry] = useState(initialData?.country || 'Philippines');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['Technology', 'AI', 'Singapore']);
  const [author, setAuthor] = useState(initialData?.author || 'Maria Santos');
  const [publishDate, setPublishDate] = useState(initialData?.publishDate || '2026-01-15');
  const [publishTime, setPublishTime] = useState(initialData?.publishTime || '14:30');
  const [publishTo, setPublishTo] = useState(initialData?.publishTo || {
    filipinoHomes: true,
    rentPh: true,
    homes: false,
    bayanihan: false,
    mainNewsPortal: true,
  });

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>(imgImage2);

  const toggleSite = (site: keyof typeof publishTo) => {
    setPublishTo({ ...publishTo, [site]: !publishTo[site] });
  };

  const handleSaveAsDraft = () => {
    alert('Saved as draft');
    onClose();
  };

  const handleSaveChanges = () => {
    alert('Changes saved');
    onClose();
  };

  const handlePublishNow = () => {
    alert('Article published!');
    onClose();
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === 'create') {
      setSlug(generateSlug(value));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[12px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">
              {mode === 'create' ? 'Create Article' : 'Edit Article'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#9ca3af]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Article Title */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Article Title <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="flex items-center gap-2 text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Slug
                <Info className="w-3.5 h-3.5 text-[#9ca3af]" />
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-slug"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
              <p className="text-[12px] text-[#9ca3af] mt-1 tracking-[-0.5px]">
                globalnews.com/articles/blog/{slug || 'philippines-emerges-ai-outsourcing-leader'}
              </p>
            </div>

            {/* Article Summary */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Article Summary <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the article"
                rows={3}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] resize-none"
              />
            </div>

            {/* Featured Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[14px] font-bold text-[#111827] tracking-[-0.5px]">
                  Featured Image <span className="text-[#ef4444]">*</span>
                </label>
                <button className="text-[12px] text-[#3b82f6] hover:underline tracking-[-0.5px]">
                  Generate Image
                </button>
              </div>
              <div className="border-2 border-dashed border-[#d1d5db] rounded-[8px] overflow-hidden">
                {featuredImage ? (
                  <div className="relative">
                    <img src={featuredImage} alt="Featured" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setShowImageUpload(true)}
                        className="px-4 py-2 bg-white rounded-[6px] text-[14px] font-medium text-[#111827]"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 px-6 text-center">
                    <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                    <p className="text-[14px] text-[#6b7280] mb-1 tracking-[-0.5px]">
                      Drag image here or click to browse
                    </p>
                    <p className="text-[12px] text-[#9ca3af] tracking-[-0.5px]">
                      Recommended: 1920x1080, max 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Article Content <span className="text-[#ef4444]">*</span>
              </label>
              
              {/* Toolbar */}
              <div className="border border-[#d1d5db] rounded-t-[6px] px-3 py-2 flex items-center gap-1 flex-wrap bg-[#f9fafb]">
                <select className="px-2 py-1 text-[13px] border border-[#d1d5db] rounded bg-white">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <Bold className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <Italic className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <Underline className="w-4 h-4 text-[#374151]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <List className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <ListOrdered className="w-4 h-4 text-[#374151]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <AlignLeft className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <AlignCenter className="w-4 h-4 text-[#374151]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <ImageIcon className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <Link className="w-4 h-4 text-[#374151]" />
                </button>
                <div className="w-px h-6 bg-[#d1d5db] mx-1" />
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <RotateCcw className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <RotateCw className="w-4 h-4 text-[#374151]" />
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors ml-auto">
                  <Maximize className="w-4 h-4 text-[#374151]" />
                </button>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={8}
                className="w-full px-4 py-3 border border-t-0 border-[#d1d5db] rounded-b-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-2 tracking-[-0.5px]">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px]"
                required
              >
                <option value="">Select Category</option>
                <option value="All News">All News</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Business">Business</option>
                <option value="Politics">Politics</option>
                <option value="Technology">Technology</option>
                <option value="Economy">Economy</option>
                <option value="Tourism">Tourism</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#3b82f6] text-white rounded-[4px] text-[13px] tracking-[-0.5px]"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setTags([...tags, e.currentTarget.value]);
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full px-4 py-2 border border-[#d1d5db] rounded-[6px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Publish Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                  Publish Time
                </label>
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[6px] text-[15px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
            </div>

            {/* Publish To */}
            <div>
              <label className="block text-[14px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">
                Publish To:
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishTo.filipinoHomes}
                    onChange={() => toggleSite('filipinoHomes')}
                    className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#111827] tracking-[-0.5px]">FilipinoHomes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishTo.rentPh}
                    onChange={() => toggleSite('rentPh')}
                    className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Rent.ph</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishTo.homes}
                    onChange={() => toggleSite('homes')}
                    className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Homes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishTo.bayanihan}
                    onChange={() => toggleSite('bayanihan')}
                    className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Bayanihan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publishTo.mainNewsPortal}
                    onChange={() => toggleSite('mainNewsPortal')}
                    className="w-5 h-5 rounded border-[#d1d5db] text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="text-[14px] text-[#111827] tracking-[-0.5px]">Main News Portal</span>
                </label>
              </div>
              <p className="text-[12px] text-[#9ca3af] mt-3 tracking-[-0.5px]">
                Article will be published on selected sites
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[15px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAsDraft}
            className="flex items-center gap-2 px-5 py-2 bg-white border border-[#d1d5db] text-[#374151] rounded-[8px] hover:bg-gray-50 transition-colors text-[15px] font-medium tracking-[-0.5px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save as Draft
          </button>
          {mode === 'edit' ? (
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-2 px-5 py-2 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[15px] font-medium tracking-[-0.5px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          ) : null}
          <button
            onClick={handlePublishNow}
            className="flex items-center gap-2 px-5 py-2 bg-[#10b981] text-white rounded-[8px] hover:bg-[#059669] transition-colors text-[15px] font-medium tracking-[-0.5px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}