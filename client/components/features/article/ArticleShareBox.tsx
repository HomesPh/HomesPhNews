"use client";

import { Button } from "@/components/ui/button";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function ArticleShareBox() {
  return (
    <div className="mt-8 mb-12 bg-blue-50/50 rounded-xl p-8 text-center border border-blue-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Found this article interesting?</h3>
      <p className="text-gray-600 mb-6 text-sm">Share it with your network.</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button className="w-full sm:w-auto bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2">
          <FaFacebookF /> Share on Facebook
        </Button>
        <Button className="w-full sm:w-auto bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white gap-2">
          <FaTwitter /> Share on Twitter
        </Button>
        <Button className="w-full sm:w-auto bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white gap-2">
          <FaLinkedinIn /> Share on LinkedIn
        </Button>
      </div>
    </div>
  );
}
