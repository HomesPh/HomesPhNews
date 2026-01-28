/**
 * API New Library
 * A well-structured, well-typed API library using Fetch API.
 * This library provides a centralized way to interact with the backend services.
 */

// Core types and client
export * from "./client";
export * from "./types";

// Domain Services
/** Article related operations including feed and admin actions */
export { articleService } from "./services/articles";

/** Admin analytics and reporting */
export { analyticsService } from "./services/analytics";

/** Authentication operations (login, logout, session) */
export { authService } from "./services/auth";

/** Site management and configuration */
export { siteService } from "./services/sites";

