"use client";

import Link from "next/link";
import { Fragment } from "react";

interface ArticleBreadcrumbProps {
  category: string;
  country: string;
}

export default function ArticleBreadcrumb({ category, country }: ArticleBreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Fragment>
        <Link href="#" className="hover:text-gray-900 transition-colors">
          {category}
        </Link>
      </Fragment>
      <span className="mx-2 text-gray-400">/</span>
      <Fragment>
        <Link href="#" className="hover:text-gray-900 transition-colors">
          {country}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
      </Fragment>
    </nav>
  );
}
