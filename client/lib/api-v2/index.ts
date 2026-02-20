/**
 * exports from public
 */
export * from "./public/services/article/getArticlesFeed";
export * from "./public/services/article/getArticlesList";
export * from "./public/services/article/getArticleById";
export * from "./public/services/article/incrementArticleViews";
export * from "./public/services/article/getStats";
export * from "./public/services/restaurant/getRestaurants";
export * from "./public/services/restaurant/getRestaurantById";
export * from "./public/services/subscription";
export * from "./public/services/ads/getAdsByCampaign";

/**
 * exports from admin
 */
export * from "./admin/service/auth/login";
export * from "./admin/service/auth/user";
export * from "./admin/service/auth/logout";
export * from "./admin/store";

export * from "./admin/service/article/getAdminArticles";
export * from "./admin/service/article/getAdminArticleById";
export * from "./admin/service/article/createArticle";
export * from "./admin/service/article/updateArticle";
export * from "./admin/service/article/updatePendingArticle";
export * from "./admin/service/article/updateArticleTitles";
export * from "./admin/service/article/publishArticle";
export * from "./admin/service/article/deleteArticle";
export * from "./admin/service/article/sendNewsletter";
export * from "./admin/service/article/bulkSendNewsletter";
export * from "./admin/service/article/getSubscribers";
export * from "./admin/service/mailing-list/groups";

export * from "./admin/service/analytics/getAdminAnalytics";
export * from "./admin/service/analytics/getMailingListStats";
export * from "./admin/service/dashboard/getAdminStats";
export * from "./admin/service/events/getAdminEvents";
export * from "./admin/service/events/createEvent";
export * from "./admin/service/events/getEventById";
export * from "./admin/service/events/updateEvent";
export * from "./admin/service/events/deleteEvent";
export * from "./admin/service/sites/getAdminSites";
export * from "./admin/service/sites/createSite";
export * from "./admin/service/sites/getAdminSiteById";
export * from "./admin/service/sites/updateSite";
export * from "./admin/service/sites/deleteSite";
export * from "./admin/service/sites/getSiteNames";
export * from "./admin/service/sites/toggleSiteStatus";
export * from "./admin/service/sites/refreshKey";
export * from "./admin/service/upload/uploadArticleImage";
export * from "./admin/service/upload/uploadImage";
export * from "./admin/service/ai/generateImages";

export * from "./admin/service/ads";
export * from "./admin/service/campaigns";
export * from "./admin/service/scraper";
export * from "./admin/service/users/createUser";


/**
 * global types
 */
export type * from "./types/ArticleResource";
export type * from "./types/UserResource";
export type * from "./types/Article";
export type * from "./types/Event";
export type * from "./types/SiteResource";
export type * from "./types/CategoryResource";
export type * from "./types/CountryResource";
export { ApiError } from "./types/ApiError";

