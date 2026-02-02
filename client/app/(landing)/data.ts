export interface Article {
  id: string;
  category: string;
  location: string;
  title: string;
  description: string;
  timeAgo: string;
  views: string;
  imageSrc: string;
  // Detailed fields
  subtitle?: string;
  author?: {
    name: string;
    avatar: string;
  };
  createdAt?: string;
  content?: string; // HTML or markdown string
  topics?: string[];
  featuredImageUrl?: string;
  relatedArticles?: Article[];
}

export const articles: Article[] = [
  {
    id: 'self-driving-cars-federal-approval',
    category: 'Business & Economy',
    location: 'USA',
    title: 'Self-Driving Cars Get Federal Approval',
    description: 'The US Department of Transportation has approved...',
    timeAgo: '5 mins ago',
    views: '100 views',
    imageSrc: 'https://placehold.co/800x450?text=Healthcare',
    featuredImageUrl: 'https://placehold.co/800x450?text=Healthcare',
    subtitle: 'A major milestone for autonomous vehicle technology as new regulations pave the way for widespread adoption.',
    author: {
      name: 'Sarah Jenkins',
      avatar: '/avatars/sarah.jpg'
    },
    createdAt: 'March 15, 2025',
    content: `
      <p>The US Department of Transportation has officially approved a new framework for autonomous vehicle operation on public roads. This landmark decision follows years of testing and safety validation.</p>
      <h2>Safety First</h2>
      <p>The new regulations require strict safety protocols, including redundant systems and real-time monitoring. interpreting data from lidar, radar, and cameras to navigate complex traffic scenarios.</p>
      <blockquote>"This is the beginning of a new era in transportation safety and efficiency," said Transportation Secretary Pete Buttigieg.</blockquote>
    `,
    topics: ['Transportation', 'AI', 'Safety', 'Regulation']
  },
  {
    id: 'singapore-ai-system',
    category: 'Business',
    location: 'Singapore',
    title: 'Singapore Launches AI-Powered System',
    description: 'Singapore unveils an integrated platform...',
    timeAgo: '1h ago',
    views: '250 views',
    imageSrc: 'https://placehold.co/800x450?text=Healthcare',
    featuredImageUrl: 'https://placehold.co/800x450?text=Healthcare',
    subtitle: 'The city-state continues to lead in smart city innovation with a new integrated platform for business operations.',
    author: {
      name: 'Wei Chen',
      avatar: '/avatars/wei.jpg'
    },
    createdAt: 'March 14, 2025',
    content: `
      <p>Singapore has unveiled a new AI-powered platform designed to streamline business registration and compliance monitoring. The system uses advanced machine learning algorithms to reduce processing times by up to 80%.</p>
      <h2>Efficiency Boost</h2>
      <p>Local businesses have welcomed the move, noting that it will significantly reduce administrative overhead. "It's a game changer for startups," said one local entrepreneur.</p>
    `,
    topics: ['Business', 'AI', 'GovTech', 'Innovation']
  },
  {
    id: 'philippines-tech-hub',
    category: 'Business & Economy',
    location: 'Philippines',
    title: 'Manila Emerges as New Tech Destination',
    description: 'The Philippine capital is seeing a surge in tech investments...',
    timeAgo: '2h ago',
    views: '500 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
    subtitle: 'Venture capital firms are increasingly looking at the Philippines as a primary market for fintech and e-commerce start-ups.',
    author: {
      name: 'Juan Dela Cruz',
      avatar: '/avatars/juan.jpg'
    },
    createdAt: 'March 13, 2025',
    content: '<p>The tech ecosystem in the Philippines is maturing rapidly, with Manila becoming a vibrant hub for innovation.</p>',
    topics: ['Tech', 'Investment', 'Manila', 'Innovation']
  },
  {
    id: 'canada-clean-energy',
    category: 'Business & Economy',
    location: 'Canada',
    title: 'Canada Invests $5B in Clean Energy Projects',
    description: 'The federal government has announced a massive investment in solar and wind power...',
    timeAgo: '3h ago',
    views: '800 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
    subtitle: 'New projects in Alberta and Ontario are expected to create thousands of green jobs by 2030.',
    author: {
      name: 'Emily Smith',
      avatar: '/avatars/emily.jpg'
    },
    createdAt: 'March 12, 2025',
    content: '<p>Canada is taking a leading role in the global transition to renewable energy with this latest funding announcement.</p>',
    topics: ['Energy', 'Environment', 'Economy', 'Canada']
  },
  {
    id: 'dubai-tourism-record',
    category: 'Community',
    location: 'Dubai',
    title: 'Dubai Sees Record Tourist Arrivals in Q1',
    description: 'Travel statistics for the first quarter of 2025 show a significant increase...',
    timeAgo: '4h ago',
    views: '1200 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
    subtitle: 'The city continues to dominate as a luxury travel destination, attracting visitors from across the globe.',
    author: {
      name: 'Ahmed Hassan',
      avatar: '/avatars/ahmed.jpg'
    },
    createdAt: 'March 11, 2025',
    content: '<p>Dubai Tourism has reported unprecedented numbers, surpassing pre-pandemic levels in several key markets.</p>',
    topics: ['Tourism', 'Dubai', 'Travel', 'Economy']
  },
  {
    id: 'europe-politics-summit',
    category: 'Labor & Employment',
    location: 'Europe',
    title: 'EU Leaders Meet to Discuss Security Strategy',
    description: 'The summit in Brussels aims to strengthen defense cooperation among member states...',
    timeAgo: '5h ago',
    views: '300 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
    subtitle: 'Defense spending and regional stability are at the top of the agenda for this year\'s political gathering.',
    author: {
      name: 'Marie Dubois',
      avatar: '/avatars/marie.jpg'
    },
    createdAt: 'March 10, 2025',
    content: '<p>European leaders are seeking a unified approach to security challenges facing the continent.</p>',
    topics: ['Politics', 'Europe', 'Security', 'EU']
  },
  {
    id: 'asia-real-estate-boom',
    category: 'Real Estate',
    location: 'Asia',
    title: 'Southeast Asia Real Estate Market Booming',
    description: 'Property prices in major Asian cities are seeing double-digit growth...',
    timeAgo: '6h ago',
    views: '950 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
    subtitle: 'International investors are flocking to regional markets, driven by robust economic growth.',
    author: {
      name: 'Kenji Tanaka',
      avatar: '/avatars/kenji.jpg'
    },
    createdAt: 'March 09, 2025',
    content: '<p>The residential and commercial sectors in Asia are experiencing a period of significant expansion.</p>',
    topics: ['Real Estate', 'Asia', 'Investment', 'Housing']
  }
];

export function getArticleById(slug: string): Article | undefined {
  return articles.find(article => article.id === slug);
}

export const trendingTopics = [
  { id: 1, label: "GPT-5 Launch" },
  { id: 2, label: "Quantum Computing" },
  { id: 3, label: "AI Ethics Debate" },
  { id: 4, label: "Robotics Revolution" },
  { id: 5, label: "Neural Interfaces" },
];