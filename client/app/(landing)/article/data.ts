import { Article } from "@/lib/api/news/types";

// dummy data, should be replaced with actual data from API
export const articleData: Article = {
  id: 1,
  country: "sg",
  category: "tech",
  title: "Singapore Unveils World's First AI-Powered Urban Management System",
  subtitle: "The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.",
  author: {
    name: "Author",
    imageUrl: "https://via.placeholder.com/150",
  },
  featuredImageUrl: "/images/singapore_mbs.png",
  createdAt: "2026-01-14T00:00:00.000Z",
  views: 100,
  content: `The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.

    Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network.

    Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.

    The city-state has integrated AI platform that manages traffic, energy, and public services with unprecedented efficiency.

    Singapore has launched the world's most advanced AI-powered urban management system, representing a quantum leap in smart city technology. The comprehensive platform integrates traffic management, energy distribution, waste collection, and emergency services into a single, intelligent network.

    Prime Minister Lee Hsien Yang unveiled the system at a ceremony in Marina Bay, describing it as "the future of urban living." The AI system processes data from millions of sensors throughout the city, making real-time decisions to optimize urban operations.`,
  topics: ["Singapore", "smart city", "urban management", "AI technology"],
  relatedArticles: [
    {
      id: "1",
      title: "Self-Driving Cars Get Federal Approval: What This Means for the Future",
      category: "Technology | USA",
      image: "/images/healthcare.jpg", // Using existing placeholder
      href: "#",
    },
    {
      id: "2",
      title: "Singapore Launches World's First AI-Powered Urban Management System",
      category: "Technology | SINGAPORE",
      image: "/images/singapore_mbs.png",
      href: "#",
    },
  ],
}