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
    category: 'Technology',
    location: 'USA',
    title: 'Self-Driving Cars Get Federal Approval',
    description: 'The US Department of Transportation has approved...',
    timeAgo: '5 mins ago',
    views: '100 views',
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
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
    imageSrc: '/healthcare.jpg',
    featuredImageUrl: '/healthcare.jpg',
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
  }
];

export function getArticleById(slug: string): Article | undefined {
  return articles.find(article => article.id === slug);
}