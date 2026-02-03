import type { Ad } from "../types";

// =============================================================================
// Mock Ad Data - Dark Humour Edition
// =============================================================================

export const mockAds: Ad[] = [
  {
    id: "ad-001",
    name: "Coffin Warehouse Sale",
    type: "image",
    placement: "header",
    size: "728x90",
    status: "active",
    content: "https://placehold.co/728x90/1a1a2e/ffffff?text=Coffins+50%25+Off!+Die+in+Style",
    link: "https://example.com/coffins",
    alt: "Coffin Warehouse - Die in Style",
    impressions: 42069,
    clicks: 666,
    priority: 10,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-002",
    name: "Existential Coffee",
    type: "image",
    placement: "sidebar-top",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/2d2d44/ffffff?text=Existential+Espresso%0ANothing+Matters+Anyway",
    link: "https://example.com/coffee",
    alt: "Existential Espresso - Nothing Matters Anyway",
    impressions: 31415,
    clicks: 271,
    priority: 8,
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-003",
    name: "Therapist Finder",
    type: "image",
    placement: "sidebar-bottom",
    size: "300x600",
    status: "active",
    content: "https://placehold.co/300x600/3d3d5c/ffffff?text=Find+A+Therapist%0ABefore+You+Find%0AAnother+Breakdown",
    link: "https://example.com/therapy",
    alt: "Find A Therapist Before You Find Another Breakdown",
    impressions: 99999,
    clicks: 1234,
    priority: 9,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-004",
    name: "Optimism Pills",
    type: "image",
    placement: "in-article",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/4a4a6a/ffffff?text=Optimism+Pills%0ASide+Effects%3A+Reality",
    link: "https://example.com/pills",
    alt: "Optimism Pills - Side Effects: Reality",
    impressions: 54321,
    clicks: 432,
    priority: 7,
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-005",
    name: "Procrastinators Club",
    type: "image",
    placement: "footer",
    size: "728x90",
    status: "active",
    content: "https://placehold.co/728x90/5c5c7a/ffffff?text=Join+Later+-+Procrastinators+Club",
    link: "https://example.com/later",
    alt: "Join Later - Procrastinators Club",
    impressions: 12345,
    clicks: 0,
    priority: 5,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-006",
    name: "False Hope Insurance",
    type: "image",
    placement: "between-articles",
    size: "970x250",
    status: "active",
    content: "https://placehold.co/970x250/6e6e8a/ffffff?text=False+Hope+Insurance%0AWe+Cover+Nothing+But+Sound+Reassuring",
    link: "https://example.com/insurance",
    alt: "False Hope Insurance - We Cover Nothing But Sound Reassuring",
    impressions: 77777,
    clicks: 777,
    priority: 8,
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-007",
    name: "Mortality Timer App",
    type: "image",
    placement: "popup",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/1a1a2e/ff6b6b?text=Mortality+Timer%0AEnjoy+the+Countdown!",
    link: "https://example.com/timer",
    alt: "Mortality Timer - Enjoy the Countdown!",
    impressions: 66666,
    clicks: 666,
    priority: 10,
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-008",
    name: "Student Loans Forever",
    type: "image",
    placement: "sidebar-top",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/2d2d44/ffd93d?text=Student+Loans%0ANow+With+Eternal+Payments!",
    link: "https://example.com/loans",
    alt: "Student Loans - Now With Eternal Payments!",
    impressions: 88888,
    clicks: 8,
    priority: 6,
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-009",
    name: "Disappointment Subscription",
    type: "image",
    placement: "in-article",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/3d3d5c/6bcb77?text=Life+Subscription%0ACancel+Anytime%0A(You+Won't)",
    link: "https://example.com/subscription",
    alt: "Life Subscription - Cancel Anytime (You Won't)",
    impressions: 45678,
    clicks: 456,
    priority: 7,
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-010",
    name: "Haunted House Realty",
    type: "image",
    placement: "header",
    size: "728x90",
    status: "active",
    content: "https://placehold.co/728x90/1a1a2e/c9b1ff?text=Haunted+Homes+-+You'll+Never+Live+Alone!",
    link: "https://example.com/haunted",
    alt: "Haunted Homes - You'll Never Live Alone!",
    impressions: 13131,
    clicks: 131,
    priority: 9,
    createdAt: "2026-01-28T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-011",
    name: "Midlife Crisis Cars",
    type: "image",
    placement: "sidebar-bottom",
    size: "160x600",
    status: "active",
    content: "https://placehold.co/160x600/4a4a6a/ff6b6b?text=Midlife+Crisis%0AMotors%0A%0ABuy+the+Car%0AYou+Can't%0AAfford",
    link: "https://example.com/cars",
    alt: "Midlife Crisis Motors - Buy the Car You Can't Afford",
    impressions: 40404,
    clicks: 404,
    priority: 8,
    createdAt: "2026-01-30T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-012",
    name: "Monday Survival Kit",
    type: "image",
    placement: "between-articles",
    size: "970x250",
    status: "active",
    content: "https://placehold.co/970x250/5c5c7a/ffd93d?text=Monday+Survival+Kit%0AIncludes+Coffee+and+Denial",
    link: "https://example.com/monday",
    alt: "Monday Survival Kit - Includes Coffee and Denial",
    impressions: 52000,
    clicks: 520,
    priority: 7,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "ad-013",
    name: "Awkward Silence Podcast",
    type: "image",
    placement: "footer",
    size: "320x50",
    status: "paused",
    content: "https://placehold.co/320x50/6e6e8a/ffffff?text=Awkward+Silence+Podcast+-+Just+Dead+Air",
    link: "https://example.com/podcast",
    alt: "Awkward Silence Podcast - Just Dead Air",
    impressions: 0,
    clicks: 0,
    priority: 3,
    createdAt: "2026-02-02T00:00:00Z",
    updatedAt: "2026-02-02T00:00:00Z",
  },
  {
    id: "ad-014",
    name: "Skeleton Gym",
    type: "image",
    placement: "sidebar-top",
    size: "300x250",
    status: "scheduled",
    startDate: "2026-10-01T00:00:00Z",
    endDate: "2026-10-31T00:00:00Z",
    content: "https://placehold.co/300x250/1a1a2e/ffffff?text=Skeleton+Gym%0ANo+Body+Required",
    link: "https://example.com/gym",
    alt: "Skeleton Gym - No Body Required",
    impressions: 0,
    clicks: 0,
    priority: 6,
    createdAt: "2026-02-03T00:00:00Z",
    updatedAt: "2026-02-03T00:00:00Z",
  },
  {
    id: "ad-015",
    name: "Abandoned Dreams Warehouse",
    type: "image",
    placement: "in-article",
    size: "300x250",
    status: "active",
    content: "https://placehold.co/300x250/2d2d44/c9b1ff?text=Abandoned+Dreams%0AWholesale+Prices!",
    link: "https://example.com/dreams",
    alt: "Abandoned Dreams - Wholesale Prices!",
    impressions: 23456,
    clicks: 234,
    priority: 7,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-03T00:00:00Z",
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get ads filtered by placement
 */
export function getAdsByPlacement(placement: string): Ad[] {
  return mockAds.filter(
    (ad) => ad.placement === placement && ad.status === "active"
  );
}

/**
 * Get a random active ad for a placement
 */
export function getRandomAdForPlacement(placement: string): Ad | null {
  const ads = getAdsByPlacement(placement);
  if (ads.length === 0) return null;

  // Weight by priority
  const totalPriority = ads.reduce((sum, ad) => sum + ad.priority, 0);
  let random = Math.random() * totalPriority;

  for (const ad of ads) {
    random -= ad.priority;
    if (random <= 0) return ad;
  }

  return ads[0];
}

/**
 * Get all active ads
 */
export function getActiveAds(): Ad[] {
  return mockAds.filter((ad) => ad.status === "active");
}

/**
 * Get ad by ID
 */
export function getAdById(id: string): Ad | undefined {
  return mockAds.find((ad) => ad.id === id);
}
