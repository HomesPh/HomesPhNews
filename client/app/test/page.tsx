"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api-v2";
import { logout } from "@/lib/api-v2";
import { createArticle } from "@/lib/api-v2/admin/service/article/createArticle";
import { getAdminArticleById } from "@/lib/api-v2/admin/service/article/getAdminArticleById";
import { getAdminArticles } from "@/lib/api-v2/admin/service/article/getAdminArticles";
import { publishArticle } from "@/lib/api-v2/admin/service/article/publishArticle";
import { rejectArticle } from "@/lib/api-v2/admin/service/article/rejectArticle";
import { updateArticle } from "@/lib/api-v2/admin/service/article/updateArticle";
import { updateArticleTitles } from "@/lib/api-v2/admin/service/article/updateArticleTitles";
import { updatePendingArticle } from "@/lib/api-v2/admin/service/article/updatePendingArticle";

// This page serves as a manual playground for all api-v2/admin article services.
// It is NOT meant for production use.

type LastResult = {
  action: string;
  ok: boolean;
  payload: unknown;
};

export default function TestPage() {
  const [articleId, setArticleId] = useState<string>("");
  const [pendingId, setPendingId] = useState<string>("");
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try {
      setLoadingAction(label);
      const res = await fn();
      // if axios response, prefer .data
      // @ts-ignore
      const payload = res?.data ?? res;
      console.log(label, payload);
      setLastResult({ action: label, ok: true, payload });
    } catch (error: any) {
      console.error(label, error);
      setLastResult({
        action: label,
        ok: false,
        payload: error?.response?.data ?? error?.message ?? String(error),
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Article API v2 Test Page</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Auth</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={loadingAction === "login"}
            onClick={() =>
              run("login", async () =>
                (
                  await login({
                    email: "admin@globalnews.com",
                    password: "admin123",
                  })
                ).data
              )
            }
          >
            {loadingAction === "login" ? "Logging in..." : "Login"}
          </Button>

          <Button
            variant="destructive"
            disabled={loadingAction === "logout"}
            onClick={() => run("logout", async () => (await logout()).data)}
          >
            {loadingAction === "logout" ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Articles (Admin)</h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={loadingAction === "getAdminArticles"}
              onClick={() =>
                run("getAdminArticles", () =>
                  getAdminArticles({
                    per_page: 5,
                    page: 1,
                  })
                )
              }
            >
              {loadingAction === "getAdminArticles"
                ? "Loading list..."
                : "Get Admin Articles (first page)"}
            </Button>

            <Button
              disabled={loadingAction === "createArticle"}
              onClick={() =>
                run("createArticle", () =>
                  createArticle({
                    title: "Test Article " + new Date().toISOString(),
                    summary: "Short test summary",
                    content: "Test content body.",
                    category: "general",
                    country: "ph",
                    status: "pending review",
                  })
                )
              }
            >
              {loadingAction === "createArticle"
                ? "Creating article..."
                : "Create Test Article"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="Article ID"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
            />

            <Button
              disabled={!articleId || loadingAction === "getAdminArticleById"}
              onClick={() =>
                run("getAdminArticleById", () => getAdminArticleById(articleId))
              }
            >
              {loadingAction === "getAdminArticleById"
                ? "Loading article..."
                : "Get Article by ID"}
            </Button>

            <Button
              disabled={!articleId || loadingAction === "updateArticle"}
              onClick={() =>
                run("updateArticle", () =>
                  updateArticle(articleId, {
                    title: "Updated title " + new Date().toISOString(),
                  })
                )
              }
            >
              {loadingAction === "updateArticle"
                ? "Updating..."
                : "Update Article (title)"}
            </Button>

            <Button
              disabled={!articleId || loadingAction === "updateArticleTitles"}
              onClick={() =>
                run("updateArticleTitles", () =>
                  updateArticleTitles(articleId, {
                    custom_titles: [
                      "Custom title A " + new Date().toISOString(),
                      "Custom title B " + new Date().toISOString(),
                    ],
                  })
                )
              }
            >
              {loadingAction === "updateArticleTitles"
                ? "Updating titles..."
                : "Update Custom Titles"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="Pending Article ID"
              value={pendingId}
              onChange={(e) => setPendingId(e.target.value)}
            />

            <Button
              disabled={!pendingId || loadingAction === "updatePendingArticle"}
              onClick={() =>
                run("updatePendingArticle", () =>
                  updatePendingArticle(pendingId, {
                    title: "Updated pending title " + new Date().toISOString(),
                  })
                )
              }
            >
              {loadingAction === "updatePendingArticle"
                ? "Updating pending..."
                : "Update Pending Article"}
            </Button>

            <Button
              disabled={!pendingId || loadingAction === "publishArticle"}
              onClick={() =>
                run("publishArticle", () =>
                  publishArticle(pendingId, {
                    published_sites: ["web"],
                    reason: "Manual publish from test page",
                  })
                )
              }
            >
              {loadingAction === "publishArticle"
                ? "Publishing..."
                : "Publish Pending Article"}
            </Button>

            <Button
              variant="destructive"
              disabled={!pendingId || loadingAction === "rejectArticle"}
              onClick={() =>
                run("rejectArticle", () =>
                  rejectArticle(pendingId, {
                    published_sites: [],
                    reason: "Manual reject from test page",
                  })
                )
              }
            >
              {loadingAction === "rejectArticle"
                ? "Rejecting..."
                : "Reject Pending Article"}
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Last Result</h2>
        <div className="rounded border bg-muted/40 p-3 text-xs font-mono overflow-auto max-h-72">
          {lastResult ? (
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          ) : (
            <span className="text-muted-foreground">
              Trigger any action above to see its response here.
            </span>
          )}
        </div>
      </section>
    </div>
  );
}