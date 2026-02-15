
import { ArticleResource } from "@/lib/api-v2/types/ArticleResource";

export const DUMMY_ARTICLES: Record<string, ArticleResource> = {
  'dummy-blog-1': {
    id: 'dummy-blog-1',
    article_id: 'dummy-blog-1',
    slug: 'metro-manila-office-vacancy-rates-drop',
    title: 'Metro Manila Office Vacancy Rates Drop to Pre-Pandemic Levels',
    summary: 'The BPO sector continues to drive demand in key business districts, signaling a robust recovery for the commercial real estate market.',
    content: `
        <p>The office market in Metro Manila is showing strong signs of recovery as vacancy rates dip to their lowest levels since 2019. Major business districts like Makati CBD and Bonifacio Global City are seeing a resurgence in leasing activity.</p>
        
        <h3>BPO Sector leading the charge</h3>
        <p>The Business Process Outsourcing (BPO) industry remains the primary driver of office demand, accounting for over 60% of new transactions in Q4 2025. With many companies enforcing return-to-office mandates, physical workspace is once again at a premium. Companies are looking for spaces that foster collaboration, something that was missed during the years of remote work.</p>
        <p>This resurgence is not just limited to traditional call centers. Knowledge Process Outsourcing (KPO) firms, which specialize in higher-value services like legal, financial, and medical research, are also expanding their footprint.</p>

        <h3>New Supply vs. Demand</h3>
        <p>New supply entering the market in upcoming quarters is expected to be absorbed quickly, keeping rental rates competitive but stable. Analysts predict a rental growth of 3-5% in prime locations over the next 12 months. Developers who paused construction during the pandemic are now rushing to complete projects to meet this renewed demand.</p>
        
        <h3>Flight to Quality</h3>
        <p>Tenants are increasingly prioritizing premium, LEED-certified buildings that offer better amenities and sustainability features, leaving older Grade B buildings with higher vacancy rates. Features like advanced air filtration systems, touchless elevators, and green spaces are now non-negotiable for many multinational tenants.</p>
        
        <h3>The Future of Flex Spaces</h3>
        <p>Another emerging trend is the demand for flexible workspaces. Companies are opting for hybrid models where they maintain a smaller core office but utilize co-working spaces for satellite teams. This shift allows for greater agility and cost-efficiency in a fluctuating economic climate.</p>
    `,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Global",
    status: "published",
    views_count: 1520,
    topics: ["Office", "Market Trends", "BPO"],
    keywords: "office, vacancy, makati, bgc",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-29T08:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-1': {
    id: 'dummy-newsletter-1',
    article_id: 'dummy-newsletter-1',
    slug: 'luxury-residential-market-resilient',
    title: 'Luxury Residential Market Resilient Despite Interest Rate Hikes',
    summary: 'High-net-worth individuals continue to invest in prime properties, viewing luxury real estate as a hedge against inflation.',
    content: `
        <p>While the broader residential market faces headwinds from rising interest rates, the luxury segment remains remarkably resilient. Prices for prime condominium units in Metro Manila have increased by 8% year-on-year.</p>
        
        <h3>Foreign Demand</h3>
        <p>International buyers are returning to the market, attracted by potentially high rental yields and capital appreciation. The weakness of the local currency has also made Philippine real estate more attractive to dollar-holding investors. We are seeing increased inquiry volumes from buyers in Singapore, Hong Kong, and the United States.</p>
        
        <h3>The Ultra-Luxury Segment</h3>
        <p>Developers are responding by launching ultra-luxury projects that offer hotel-like amenities and branded residences. Partnerships with luxury hotel chains are becoming common, offering residents concierge services, housekeeping, and access to exclusive facilities.</p>
        
        <h3>Investment Value</h3>
        <p>High-net-worth individuals view luxury real estate as a safe haven asset—a hedge against inflation and market volatility. Unlike stocks or crypto, prime property offers tangible value and utility. Historical data suggests that luxury real estate values in Metro Manila tend to appreciate steadily over the long term, even during economic downturns.</p>
        
        <h3>Key Locations</h3>
        <p>Makati and BGC remain the top choices, but we are also seeing interest spill over into emerging luxury enclaves in Alabang and Ortigas. The accessibility provided by new infrastructure projects like the Metro Manila Subway is also influencing buyer preferences.</p>
    `,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80',
    category: "Business & Economy",
    country: "Saudi Arabia",
    status: "published",
    views_count: 2200,
    topics: ["Luxury", "Investment", "Residential"],
    keywords: "luxury, condo, investment",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-28T10:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-blog-2': {
    id: 'dummy-blog-2',
    article_id: 'dummy-blog-2',
    slug: 'sustainable-allocations-green-buildings',
    title: 'Sustainable Allocations: Green Buildings Become the New Standard',
    summary: 'Developers are racing to achieve LEED and BERDE certifications as tenants increasingly demand eco-friendly workspaces.',
    content: `
        <p>Sustainability is no longer just a "nice-to-have"; it is a business imperative. Multinational corporations have strict carbon footprint targets, making green-certified buildings the only option for their headquarters.</p>
        
        <h3>Benefits Beyond Environment</h3>
        <p>Beyond the environmental impact, green buildings offer operational savings through energy efficiency and improved employee health and productivity due to better air quality and natural lighting. Studies have shown that employees working in green-certified buildings report fewer sick days and higher job satisfaction.</p>
        
        <h3>Regulatory Push</h3>
        <p>Local governments are also playing a role, offering tax incentives for developers who meet green building standards. This regulatory push is accelerating the adoption of sustainable practices across the construction industry.</p>
        
        <h3>Innovative Technologies</h3>
        <p>We are seeing the integration of smart building management systems that optimize energy use in real-time. From automated lighting to smart cooling systems, technology is at the forefront of the green revolution. Solar panels, rainwater harvesting systems, and vertical gardens are becoming standard features in new developments.</p>
    `,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Global",
    status: "published",
    views_count: 850,
    topics: ["Sustainability", "LEED", "Green Tech"],
    keywords: "sustainable, housing, green",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-27T14:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-2': {
    id: 'dummy-newsletter-2',
    article_id: 'dummy-newsletter-2',
    slug: 'proptech-revolution-ai-valuation',
    title: 'PropTech Revolution: How AI is Changing Property Valuation',
    summary: 'Automated Valuation Models (AVMs) are reducing turnaround times from days to minutes, transforming the mortgage landscape.',
    content: `
        <p>The traditional appraisal process is being disrupted by Artificial Intelligence. New PropTech startups are using big data to provide instant, accurate property valuations.</p>
        <p>This shift is enabling banks to process mortgage applications faster and giving investors real-time insights into market value trends across different micro-markets. Traditionally, getting a property appraisal could take anywhere from 3 to 7 days. With AI-driven AVMs, this can now be done in seconds.</p>
        
        <h3>Data-Driven Decisions</h3>
        <p>Investors can now access granular data on rental yields, capital appreciation, and neighborhood demographics. This level of transparency was previously available only to large institutional players. Now, retail investors can make data-driven decisions with confidence.</p>
        
        <h3>Virtual Tours and Augmented Reality</h3>
        <p>Beyond valuation, technology is changing how we view properties. Virtual reality (VR) tours allow buyers to inspect homes from the comfort of their living rooms. Augmented reality (AR) apps enable them to visualize how furniture would look in an empty space. These tools are streamlining the buying process and reducing the friction of physical viewings.</p>
        
        <h3>The Human Element</h3>
        <p>Despite these advancements, the role of the real estate agent remains crucial. AI can crunch numbers, but it cannot negotiate complex deals or provide the emotional support often needed during a home purchase. The future is a hybrid model where agents are empowered by AI tools to deliver superior service.</p>
    `,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    category: "Success Stories",
    country: "United Arab Emirates",
    status: "published",
    views_count: 1890,
    topics: ["PropTech", "AI", "Valuation"],
    keywords: "ai, tech, real estate, proptech",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-26T09:30:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-3': {
    id: 'dummy-newsletter-3',
    article_id: 'dummy-newsletter-3',
    slug: 'central-bank-pauses-rate-hikes',
    title: 'Central Bank Pauses Rate Hikes as Inflation Cools',
    summary: 'Good news for borrowers: mortgage rates are expected to stabilize as the BSP signals a pause in monetary tightening.',
    content: `
        <p>The Bangko Sentral ng Pilipinas (BSP) has kept its key policy rates unchanged for the second consecutive meeting, signaling that the worst of the inflation surge may be over. This decision provides much-needed relief to the real estate market.</p>

        <h3>Impact on Mortgages</h3>
        <p>For potential homebuyers, this means mortgage rates are likely to stabilize. While we may not see a return to the historic lows of the pandemic era anytime soon, the unpredictability of monthly amortizations is diminishing. Banks are expected to offer more attractive fixed-rate terms to entice borrowers back into the market.</p>

        <h3>Market Sentiment</h3>
        <p>Consumer confidence is slowly returning. Developers have reported an uptick in reservation sales in the last month, particularly in the mid-income segment. The pause in rate hikes is seen as a "green light" for those who have been sitting on the sidelines, waiting for clearer economic signals.</p>
    `,
    image: 'https://images.unsplash.com/photo-1518183214770-9cffbec72538?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1518183214770-9cffbec72538?auto=format&fit=crop&q=80',
    category: "Market Insight",
    country: "Philippines",
    status: "published",
    views_count: 3500,
    topics: ["Finance", "Economy", "Interest Rates"],
    keywords: "bsp, inflation, mortgage",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-26T08:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-4': {
    id: 'dummy-newsletter-4',
    article_id: 'dummy-newsletter-4',
    slug: 'township-developments-visayas',
    title: 'The Resurgence of Township Developments in the Visayas',
    summary: 'Major developers are shifting focus to Cebu and Iloilo, launching integrated communities that combine work, live, and play.',
    content: `
        <p>Metro Manila is becoming saturated, and developers are looking South. Visayas, particularly Cebu and Iloilo, is witnessing a boom in township developments. These master-planned communities offer a holistic lifestyle that is appealing to the modern Filipino family.</p>

        <h3>Why Visayas?</h3>
        <p>Infrastructure improvements, such as expanded airports and new bridges, have improved connectivity. Furthermore, the local economy in these regions is growing faster than the national average, driven by tourism and the BPO sector.</p>
        
        <h3>Integrated Living</h3>
        <p>The township model—where malls, offices, schools, and residential condos are all within walking distance—is proving to be a winning formula. It addresses the worsening traffic in urban centers by creating self-sustaining districts.</p>
    `,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80',
    category: "Market Insight",
    country: "Philippines",
    status: "published",
    views_count: 2100,
    topics: ["Development", "Visayas", "Urban Planning"],
    keywords: "township, cebu, iloilo",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-25T14:20:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-5': {
    id: 'dummy-newsletter-5',
    article_id: 'dummy-newsletter-5',
    slug: 'office-leasing-pogo-returning',
    title: 'Office Leasing Market: Is the POGO Sector Returning?',
    summary: 'Rumors of new offshore gaming licenses are stirring activity in the Bay Area office market, though regulatory hurdles remain.',
    content: `
        <p>The Philippine Offshore Gaming Operator (POGO) sector, once the darling of the office market, faced a steep decline. However, recent movements in the Bay Area suggest a potential, albeit quieter, comeback.</p>

        <h3>Leasing Activity</h3>
        <p>Real estate brokers confirm receiving inquiries for large floor plates from offshore gaming entities. While not at the frenzy levels of 2018-2019, the demand is significant enough to move the needle on vacancy rates in Pasay and Parañaque.</p>

        <h3>Regulatory Landscape</h3>
        <p>The government remains cautious. New regulations aimed at taxing the sector more effectively and ensuring strict compliance are in place. This "cleaner" version of the industry might be more sustainable in the long run, but it also means growth will be more measured.</p>
    `,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    category: "Market Insight",
    country: "Philippines",
    status: "published",
    views_count: 4800,
    topics: ["Office", "POGO", "Regulation"],
    keywords: "pogo, office, bay area",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-24T11:45:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-newsletter-6': {
    id: 'dummy-newsletter-6',
    article_id: 'dummy-newsletter-6',
    slug: 'home-loan-interest-rates-h2-2026',
    title: 'Home Loan Interest Rates: What to Expect in H2 2026',
    summary: 'Expert analysis on whether you should fix your mortgage rate now or wait for potential cuts later in the year.',
    content: `
        <p>Trying to time the market is difficult, especially with mortgage rates. Current bank rates for a 5-year fixed term range from 7% to 8.5%. The question on every borrower's mind: will it go down?</p>

        <h3>The Analyst View</h3>
        <p>Most economic forecasts point to a slight easing of rates towards the end of 2026. However, any geopolitical shock could reverse this trend. The consensus advice? If you are buying a home to live in, don't wait for the "perfect" rate. If the numbers make sense for your budget today, lock it in.</p>

        <h3>Refinancing Options</h3>
        <p>Remember, you can always refinance later if rates drop significantly. Many banks are now offering flexible loan packages that allow for re-pricing after a year or two without heavy penalties.</p>
    `,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
    category: "Market Insight",
    country: "Philippines",
    status: "published",
    views_count: 3100,
    topics: ["Finance", "Mortgage", "Advice"],
    keywords: "loan, interest, bank",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-23T09:15:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  // NEW BLOGS
  'dummy-blog-3': {
    id: 'dummy-blog-3',
    article_id: 'dummy-blog-3',
    slug: 'condo-living-vs-house-and-lot',
    title: 'Condo Living vs House and Lot: Which is Right for You?',
    summary: 'A comprehensive pros and cons analysis of vertical living versus traditional horizontal housing in the current market.',
    content: `
        <p>One of the biggest dilemmas for first-time homebuyers in the Philippines is choosing between a condominium unit and a house and lot. Both have their distinct advantages and trade-offs, and the "right" choice depends heavily on your lifestyle, budget, and long-term goals.</p>
        
        <h3>The Case for Condos</h3>
        <p>Condominiums offer unparalleled convenience. Typically located near business districts, malls, and transit hubs, they save you hours of commute time. Amenities like gyms, pools, and 24/7 security are standard.</p>
        <ul>
            <li><strong>Pros:</strong> Location, amenities, security, lower maintenance.</li>
            <li><strong>Cons:</strong> Monthly association dues, smaller living space, less privacy.</li>
        </ul>
        
        <h3>The Appeal of House and Lot</h3>
        <p>For those who value space and privacy, a house and lot is the traditional choice. You own the land, which historically appreciates better than the structure itself. You have the freedom to renovate and expand.</p>
        <ul>
            <li><strong>Pros:</strong> Ownership of land, more space, no monthly assoc dues (usually), privacy.</li>
            <li><strong>Cons:</strong> Further from city centers, higher maintenance responsibility, security concerns.</li>
        </ul>
        
        <h3>Verdict</h3>
        <p>If you prioritize location and a "lock-and-leave" lifestyle, a condo is ideal. If you want a place to raise a large family and value land ownership, a house and lot in the suburbs might be better.</p>
    `,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Philippines",
    status: "published",
    views_count: 3100,
    topics: ["Guide", "Housing", "Lifestyle"],
    keywords: "condo, house, guide",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-25T11:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-blog-4': {
    id: 'dummy-blog-4',
    article_id: 'dummy-blog-4',
    slug: 'rise-of-smart-cities',
    title: 'The Rise of Smart Cities in the Philippines',
    summary: 'How Clark Global City, New Clark City, and Davao Global Township are setting the benchmark for urban planning.',
    content: `
        <p>The concept of "Smart Cities" is taking root in the Philippines. These are not just residential developments but fully integrated townships designed for efficiency, sustainability, and quality of life.</p>
        
        <h3>New Clark City: The Green Metropolis</h3>
        <p>Located in Tarlac, New Clark City is poised to be the country's first smart, resilient, and green metropolis. With autonomous transport systems, wide pedestrian lanes, and extensive green spaces, it offers a glimpse into the future of urban living.</p>
        
        <h3>Davao Global Township</h3>
        <p>In the south, Davao Global Township is transforming the old Matina golf course into a central business district. It emphasizes walkability and connectivity, reducing reliance on cars.</p>
        
        <h3>Why it Matters</h3>
        <p>Smart cities attract foreign investment and create jobs. For residents, it means less traffic, cleaner air, and better access to services. As Metro Manila becomes more congested, these alternative urban centers will drive the country's economic growth.</p>
    `,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Philippines",
    status: "published",
    views_count: 2450,
    topics: ["Smart City", "Urban Planning", "Future"],
    keywords: "smart city, clark, davao",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-24T15:30:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-blog-5': {
    id: 'dummy-blog-5',
    article_id: 'dummy-blog-5',
    slug: 'investing-in-reits-beginners-guide',
    title: 'Investing in REITs: A Guide for Beginners',
    summary: 'Demystifying Real Estate Investment Trusts. Learn how to earn passive income from real estate without buying a property.',
    content: `
        <p>Real Estate Investment Trusts (REITs) have democratized real estate investing. You no longer need millions of pesos to own a stake in prime commercial properties. With a few thousand pesos, you can buy shares of a REIT on the stock market.</p>
        
        <h3>How it Works</h3>
        <p>REIT companies own and operate income-generating real estate like office towers and malls. By law, they must distribute at least 90% of their distributable income as dividends to shareholders. This provides investors with a regular stream of passive income.</p>
        
        <h3>Benefits of REITs</h3>
        <ul>
            <li><strong>Liquidity:</strong> Unlike physical property, you can sell REIT shares instantly during market hours.</li>
            <li><strong>Diversification:</strong> You effectively own a small piece of multiple properties.</li>
            <li><strong>Professional Management:</strong> The properties are managed by experts.</li>
        </ul>
        
        <h3>Risks to Consider</h3>
        <p>Like any stock, REIT prices can fluctuate. They are also sensitive to interest rates; when rates rise, REIT yields may become less attractive compared to bonds.</p>
    `,
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80',
    category: "Business & Economy",
    country: "Singapore",
    status: "published",
    views_count: 1800,
    topics: ["Investment", "REIT", "Finance"],
    keywords: "reit, investment, finance",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-23T08:45:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-blog-6': {
    id: 'dummy-blog-6',
    article_id: 'dummy-blog-6',
    slug: 'emerging-property-hotspots',
    title: 'Top 5 Emerging Property Hotspots Outside Metro Manila',
    summary: 'Looking for high capital appreciation? Look north to Pampanga and south to Laguna and Cavite.',
    content: `
        <p>As land values in Metro Manila skyrocket, savvy investors are looking towards the fringes. The government's "Build, Build, Build" program has improved connectivity, unlocking the potential of nearby provinces.</p>
        
        <h3>1. Pampanga</h3>
        <p>Dubbed the "Gateway to the North," Pampanga benefits from the Clark International Airport and the upcoming railway projects.</p>
        
        <h3>2. Laguna</h3>
        <p>Laguna remains a favorite for industrial parks and residential communities, offering a balance of nature and urban convenience.</p>
        
        <h3>3. Cavite</h3>
        <p>With the CAVITEX and CALAX expressways, Cavite is now essentially a suburb of Manila. It offers affordable housing options for the middle class.</p>
        
        <h3>4. Iloilo City</h3>
        <p>In the Visayas, Iloilo is a model of good governance and urban planning, attracting BPOs and developers alike.</p>
        
        <h3>5. Bacolod City</h3>
        <p>Known for its laid-back lifestyle, Bacolod is steadily growing its IT-BPM sector, driving demand for office and residential spaces.</p>
    `,
    image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Philippines",
    status: "published",
    views_count: 2900,
    topics: ["Investment", "Provinces", "Growth"],
    keywords: "pampanga, laguna, cavite, investment",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-22T13:15:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-blog-7': {
    id: 'dummy-blog-7',
    article_id: 'dummy-blog-7',
    slug: 'how-to-spot-real-estate-scam',
    title: 'How to Spot a Real Estate Scam',
    summary: 'Protect your hard-earned money. Essential tips on verifying titles, checking licenses, and avoiding "colorum" agents.',
    content: `
        <p>Real estate is a high-value transaction, making it a prime target for scammers. From fake titles to "colorum" agents, the risks are real. Here is how to protect yourself.</p>
        
        <h3>1. Check the License</h3>
        <p>Always deal with a licensed Real Estate Broker or accredited salesperson. Ask for their PRC ID. You can verify their license number on the PRC website.</p>
        
        <h3>2. Verify the Title</h3>
        <p>Never buy a property without seeing the "Transfer Certificate of Title" (TCT). Get a "Certified True Copy" from the Registry of Deeds to ensure it is authentic and free of liens/encumbrances.</p>
        
        <h3>3. Visit the Site</h3>
        <p>Be wary of "preselling" scams where the project does not exist. Always conduct a site visit. If the project is still on paper, check if they have a "License to Sell" from the DHSUD.</p>
        
        <h3>4. Avoid "Too Good to Be True" Deals</h3>
        <p>If a property is priced significantly below market value, ask why. Scammers often use low prices to lure victims into a quick sale.</p>
    `,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    category: "Real Estate",
    country: "Philippines",
    status: "published",
    views_count: 4200,
    topics: ["Safety", "Guide", "Law"],
    keywords: "scam, safety, tips",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-21T10:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  // Restaurant Items
  'dummy-rest-1': {
    id: 'dummy-rest-1',
    article_id: 'dummy-rest-1',
    slug: 'global-palate-filipino-cuisine',
    title: 'Global Palate: Filipino Cuisine Takes Center Stage in Major Capitals',
    summary: 'From New York to London, Filipino chefs are redefining fine dining with elevated takes on classic dishes like Adobo and Sinigang.',
    content: `
        <p>Filipino cuisine is finally having its global moment. For years considered the "next big thing," it has now firmly arrived, with Filipino-owned restaurants opening in major culinary capitals around the world.</p>
        
        <h3>The Rise of Pinoy Flavors</h3>
        <p>Chefs are elevating traditional dishes like adobo, sinigang, and kare-kare, presenting them with modern techniques while staying true to their roots. In cities like Los Angeles/London, long queues are common outside establishments serving sizzling sisig and halo-halo. The complexity of Filipino flavors—sour, salty, sweet, and funky—is finding a receptive audience among global gourmands.</p>
        
        <h3>Kasama in Chicago</h3>
        <p>A prime example is Kasama in Chicago, the first Filipino restaurant to be awarded a Michelin star. Their tasting menu journeys through the archipelago's culinary history, serving dishes like mushroom adobo and upscale lechon.</p>
        
        <h3>Global Recognition</h3>
        <p>Critics are taking notice. Several Filipino restaurants have recently received Michelin stars or Bib Gourmand mentions, validating the complexity and deliciousness of the cuisine. Food documentaries and features by influential food writers have also helped propel the movement.</p>
    `,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Global",
    status: "published",
    views_count: 1250,
    topics: ["Filipino Food", "Global Dining", "Chefs"],
    keywords: "filipino, restaurant, pinoy, food",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-28T09:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-rest-2': {
    id: 'dummy-rest-2',
    article_id: 'dummy-rest-2',
    slug: 'metro-manila-fine-dining',
    title: 'Metro Manila Fine Dining: A Renaissance of Local Ingredients',
    summary: 'A new wave of chefs is championing endemic ingredients, transforming the local dining landscape.',
    content: `
        <p>Manila is no longer just a stopover; it is a destination for food lovers. The city's fine dining scene has exploded in recent years, driven by a new generation of chefs returning home from stints in top kitchens abroad.</p>
        
        <h3>Local Ingredients, World-Class Technique</h3>
        <p>These restaurants are highlighting local ingredients—from Bukidnon wagyu to Davao chocolate—showcasing the biodiversity of the Philippines. Instead of importing foie gras or truffles, chefs are foraging for local ferns, using souring agents like batuan, and celebrating the unique terroir of the islands.</p>
        
        <h3>Tasting Menus</h3>
        <p>The rise of the tasting menu format allows chefs to tell a narrative. Diners are treated to a story of the Philippines, plate by plate. This educational aspect adds depth to the dining experience, connecting patron to producer.</p>
    `,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Philippines",
    status: "published",
    views_count: 980,
    topics: ["Fine Dining", "Manila", "Luxury"],
    keywords: "manila, dining, luxury",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-27T14:30:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-rest-3': {
    id: 'dummy-rest-3',
    article_id: 'dummy-rest-3',
    slug: 'sustainable-sourcing-island-resorts',
    title: 'Sustainable Sourcing: Island Resorts Lean into Farm-to-Table',
    summary: 'Resorts in Boracay and Palawan are establishing their own organic farms to ensure quality and sustainability.',
    content: `
        <p>Sustainability is more than a buzzword for restaurants in the Philippines' top island destinations. With the ocean as their backyard, chefs are acutely aware of the need to protect marine resources.</p>
        
        <h3>Farm to Table, Ocean to Plate</h3>
        <p>Many establishments now work directly with local fisherfolk to ensure fair trade and sustainable catch methods. This not only helps the environment but ensures the freshest possible ingredients for diners. Resorts are also cultivating their own herb gardens and organic vegetable patches to reduce their carbon footprint from logistics.</p>
        
        <h3>Reducing Waste</h3>
        <p>Zero-waste initiatives are gaining traction. Kitchens are finding creative ways to use every part of the ingredient—from vegetable peels made into chips to fish bones simmered for stock. Composting and banning single-use plastics are now standard practices in top-tier resorts.</p>
    `,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Philippines",
    status: "published",
    views_count: 850,
    topics: ["Sustainability", "Seafood", "Island Life"],
    keywords: "sustainable, seafood, boracay, palawan",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-26T11:15:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-rest-4': {
    id: 'dummy-rest-4',
    article_id: 'dummy-rest-4',
    slug: 'street-food-elevated',
    title: 'Street Food Elevated: Reimagining Isaw and Balut for the Global Palate',
    summary: 'How humble street food staples are finding their way onto tasting menus.',
    content: `
        <p>Street food is the heart of Filipino food culture. Now, it's getting a gourmet makeover. From wagyu isaw to foie gras balut, chefs are reimagining humble snacks for upscale palates.</p>
        <p>This trend is about honoring the flavors of the street while applying the precision of fine dining. It challenges the notion that Filipino food must be cheap to be authentic.</p>
        <p>For example, "dirty ice cream" (sorbetes) is being served with gold leaf and artisanal toppings. The humble pork barbecue is being elevated with premium cuts of meat and aged glazes.</p>
    `,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Philippines",
    status: "published",
    views_count: 1500,
    topics: ["Street Food", "Innovation", "Culture"],
    keywords: "street food, gourmet, manila",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-25T16:45:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-rest-5': {
    id: 'dummy-rest-5',
    article_id: 'dummy-rest-5',
    slug: 'jollibee-expansion-europe',
    title: 'Jollibee Foods Corp Accelerates European Expansion Strategy',
    summary: 'The fast-food giant considers new markets in Eastern Europe as Chickenjoy conquers the UK and Italy.',
    content: `
        <p>Jollibee Foods Corporation shows no signs of slowing down. The fast-food giant has announced ambitious plans to expand its footprint in Europe, bringing Chickenjoy to more cities across the continent.</p>
        <p>Following successful launches in London, Rome, and Madrid, the brand is targeting secondary cities and new markets in Eastern Europe. The strategy relies on catering to the large Filipino diaspora while converting locals with its flagship fried chicken.</p>
        <p>Analysts believe Jollibee is well-positioned to become a top 5 global fast-food brand within the decade, rivaling established western giants.</p>
    `,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Global",
    status: "published",
    views_count: 3000,
    topics: ["Fast Food", "Business", "Expansion"],
    keywords: "jollibee, business, food",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-24T08:20:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-rest-6': {
    id: 'dummy-rest-6',
    article_id: 'dummy-rest-6',
    slug: 'coffee-culture-cebu',
    title: 'Coffee Culture: The Third Wave Experience in Cebu',
    summary: 'Local roasters in Cebu are putting Philippine coffee beans on the map, offering world-class brews in instagram-mable spaces.',
    content: `
        <p>Cebu City is known for its lechon and historical landmarks, but a quiet revolution is emerging in its streets—the third wave coffee movement. Gone are the days when coffee was just a morning jolt; it is now an experience, a craft, and a lifestyle.</p>

        <h3>The Local Bean</h3>
        <p>Independent coffee shops like "Linear Coffee Roasters" and "The Daily Grind" are championing local beans, particularly from Mount Apo and Bukidnon. By roasting small batches on-site, they are able to extract complex flavor profiles that rival international brands.</p>

        <h3>Aesthetic and Community</h3>
        <p>These cafes are also designed to be community hubs. With industrial-chic interiors, lush greenery, and fast fiber internet, they attract digital nomads, students, and creatives. The coffee shop has become the modern-day plaza, a place for connection and conversation.</p>
    `,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80',
    category: "Restaurant",
    country: "Philippines",
    status: "published",
    views_count: 2200,
    topics: ["Coffee", "Cafe", "Cebu"],
    keywords: "coffee, cebu, cafe",
    source: "HomesTV",
    original_url: "#",
    created_at: "2026-01-23T15:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-labor-1': {
    id: 'dummy-labor-1',
    article_id: 'dummy-labor-1',
    slug: 'ofw-labor-protections-gulf',
    title: 'New Labor Protections for OFWs in the Gulf Region',
    summary: 'Recent bilateral agreements aim to enhance welfare and legal support for Filipino workers in Saudi Arabia and the UAE.',
    content: `
        <p>A new milestone in industrial relations has been reached with the signing of comprehensive bilateral agreements between the Philippines and major Gulf nations. These agreements are designed to provide unprecedented levels of protection for Overseas Filipino Workers (OFWs).</p>
        <h3>Enhanced Legal Support</h3>
        <p>The new framework includes the establishment of specialized legal aid centers available 24/7. Workers now have direct access to multi-lingual legal counsel to resolve contract disputes without fear of retaliation.</p>
        <h3>Welfare Improvements</h3>
        <p>Standardized wage protections and improved housing requirements are also part of the pact. Regular site inspections by joint monitoring teams will ensure that living conditions meet international labor standards.</p>
    `,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
    category: "Labor & Employment",
    country: "Global",
    status: "published",
    views_count: 4200,
    topics: ["Labor", "OFW", "Protection"],
    keywords: "labor, reform, policy",
    source: "HomesPh News",
    original_url: "#",
    created_at: "2026-01-23T08:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  },
  'dummy-health-1': {
    id: 'dummy-health-1',
    article_id: 'dummy-health-1',
    slug: 'telemedicine-adoption-rural',
    title: 'Healthcare Innovation: Telemedicine adoption rises in rural communities',
    summary: 'Digital health platforms are bridging the gap in medical access for island communities across the Philippines.',
    content: `
        <p>Innovation in the healthcare sector is transforming lives in the most remote corners of the Philippines. Telemedicine, once a niche technology, has become a lifeline for island provinces where specialist doctors are often a boat ride away.</p>
        <h3>Bridging the Gap</h3>
        <p>Through high-speed satellite internet and portable diagnostic kits, rural health workers can now consult with top specialists in Manila in real-time. This has significantly reduced the cost and risk associated with emergency medical travel.</p>
        <h3>Training and Infrastructure</h3>
        <p>The government and private sectors are collaborating to train local practitioners on digital health tools. New infrastructure developments are ensuring that even mountainous regions have the connectivity required for stable video consultations.</p>
    `,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
    category: "Healthcare",
    country: "Philippines",
    status: "published",
    views_count: 1800,
    topics: ["Healthcare", "Tech", "Rural"],
    keywords: "health, telemed, innovation",
    source: "HomesPh News",
    original_url: "#",
    created_at: "2026-01-22T10:00:00.000Z",
    published_sites: [],
    sites: [],
    galleryImages: [],
    is_deleted: false,
    is_redis: false
  }
};

export const mockSpecialtyContent = Object.values(DUMMY_ARTICLES);
