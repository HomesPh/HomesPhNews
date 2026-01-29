"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import * as api from "@/lib/api-v2";

type LastResult = {
  action: string;
  ok: boolean;
  payload: unknown;
};

export default function TestPage() {
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Input states for IDs
  const [articleId, setArticleId] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [eventId, setEventId] = useState("");
  const [siteId, setSiteId] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const run = async (label: string, fn: () => Promise<any>) => {
    try {
      setLoadingAction(label);
      const res = await fn();
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

  const ActionRow = ({
    label,
    action,
    onClick,
    variant = "default",
    disabled = false,
    description
  }: {
    label: string,
    action: string,
    onClick: () => Promise<any>,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    disabled?: boolean,
    description?: string
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Button
        variant={variant}
        disabled={disabled || loadingAction === action}
        onClick={() => run(action, onClick)}
        size="sm"
        className="w-full sm:w-28"
      >
        {loadingAction === action ? "Running..." : "Execute"}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-8 min-h-screen bg-background">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin API v2 Playground</h1>
          <p className="text-muted-foreground">Interactive diagnostic tool for admin services.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2 py-0.5">API v2</Badge>
          <Badge variant="outline" className="px-2 py-0.5 border-amber-500 text-amber-500">Development</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 gap-1">
              <TabsTrigger value="auth" className="py-2">Auth</TabsTrigger>
              <TabsTrigger value="articles" className="py-2">Articles</TabsTrigger>
              <TabsTrigger value="events" className="py-2">Events</TabsTrigger>
              <TabsTrigger value="sites" className="py-2">Sites</TabsTrigger>
              <TabsTrigger value="stats" className="py-2">Stats</TabsTrigger>
              <TabsTrigger value="more" className="py-2">More</TabsTrigger>
            </TabsList>

            <div className="mt-8 space-y-6">
              {/* AUTH TAB */}
              <TabsContent value="auth" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>Manage your administrative session.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Admin Login"
                      action="login"
                      description="Login with default admin credentials"
                      onClick={() => api.login({ email: "admin@globalnews.com", password: "admin123" })}
                    />
                    <ActionRow
                      label="Get Auth User"
                      action="getUser"
                      description="Retrieve current authenticated user details"
                      onClick={() => api.getUser()}
                    />
                    <Separator />
                    <ActionRow
                      label="Logout"
                      action="logout"
                      variant="destructive"
                      description="Terminate the current session"
                      onClick={() => api.logout()}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ARTICLES TAB */}
              <TabsContent value="articles" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Operations</CardTitle>
                    <CardDescription>Test listing and creating articles.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Get Admin Articles"
                      action="getAdminArticles"
                      description="List first 5 articles with status counts"
                      onClick={() => api.getAdminArticles({ per_page: 5, page: 1 })}
                    />
                    <ActionRow
                      label="Create Test Article"
                      action="createArticle"
                      description="Create a new article in pending review state"
                      onClick={() => api.createArticle({
                        title: "Test Article " + new Date().toLocaleTimeString(),
                        summary: "Automated test summary generated for API validation.",
                        content: "Full content body for the test article.",
                        category: "general",
                        country: "ph",
                        status: "pending review"
                      })}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Specific Article Actions</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Target Article ID"
                        value={articleId}
                        onChange={e => setArticleId(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Get Article By ID"
                      action="getAdminArticleById"
                      disabled={!articleId}
                      onClick={() => api.getAdminArticleById(articleId)}
                    />
                    <ActionRow
                      label="Update Generic Article"
                      action="updateArticle"
                      disabled={!articleId}
                      description="Updates title with a timestamp"
                      onClick={() => api.updateArticle(articleId, { title: "Updated: " + new Date().toLocaleTimeString() })}
                    />
                    <ActionRow
                      label="Update Custom Titles"
                      action="updateArticleTitles"
                      disabled={!articleId}
                      description="Sets custom A/B titles"
                      onClick={() => api.updateArticleTitles(articleId, {
                        custom_titles: ["Variation X - " + Date.now(), "Variation Y - " + Date.now()]
                      })}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-amber-600">Workflow: Publish / Reject</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Pending ID"
                        value={pendingId}
                        onChange={e => setPendingId(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Update Pending Record"
                      action="updatePendingArticle"
                      disabled={!pendingId}
                      onClick={() => api.updatePendingArticle(pendingId, { title: "Updated Pending Article" })}
                    />
                    <ActionRow
                      label="Publish Article"
                      action="publishArticle"
                      variant="secondary"
                      disabled={!pendingId}
                      onClick={() => api.publishArticle(pendingId, {
                        published_sites: ["web"],
                        reason: "Validated via Test Page"
                      })}
                    />
                    <ActionRow
                      label="Reject Article"
                      action="rejectArticle"
                      variant="destructive"
                      disabled={!pendingId}
                      onClick={() => api.rejectArticle(pendingId, {
                        published_sites: [],
                        reason: "Rejected via Test Page"
                      })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* EVENTS TAB */}
              <TabsContent value="events" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Create and track system events.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="List All Events"
                      action="getAdminEvents"
                      onClick={() => api.getAdminEvents()}
                    />
                    <ActionRow
                      label="Create New Event"
                      action="createEvent"
                      onClick={() => api.createEvent({
                        event_title: "System Check",
                        description: "Manual triggering of system event check",
                        date: new Date().toISOString()
                      })}
                    />
                    <Separator />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Event ID (numeric)"
                        value={eventId}
                        onChange={e => setEventId(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <ActionRow
                      label="Get Event By ID"
                      action="getEventById"
                      disabled={!eventId}
                      onClick={() => api.getEventById(Number(eventId))}
                    />
                    <ActionRow
                      label="Update Event"
                      action="updateEvent"
                      disabled={!eventId}
                      onClick={() => api.updateEvent(Number(eventId), { event_title: "MODIFIED EVENT" })}
                    />
                    <ActionRow
                      label="Delete Event"
                      action="deleteEvent"
                      variant="destructive"
                      disabled={!eventId}
                      onClick={() => api.deleteEvent(Number(eventId))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SITES TAB */}
              <TabsContent value="sites" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Configuration</CardTitle>
                    <CardDescription>Manage multi-site deployment targets.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Get Admin Sites"
                      action="getAdminSites"
                      onClick={() => api.getAdminSites()}
                    />
                    <ActionRow
                      label="Get Active Site Names"
                      action="getSiteNames"
                      onClick={() => api.getSiteNames()}
                    />
                    <ActionRow
                      label="Register New Site"
                      action="createSite"
                      onClick={() => api.createSite({
                        name: "Test Site " + Date.now(),
                        domain: `test-${Date.now()}.example.com`,
                        description: "Experimental site Target"
                      })}
                    />
                    <Separator />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Site ID (numeric)"
                        value={siteId}
                        onChange={e => setSiteId(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <ActionRow
                      label="Get Site By ID"
                      action="getAdminSiteById"
                      disabled={!siteId}
                      onClick={() => api.getAdminSiteById(Number(siteId))}
                    />
                    <ActionRow
                      label="Update Site"
                      action="updateSite"
                      disabled={!siteId}
                      onClick={() => api.updateSite(Number(siteId), { name: "Updated Site " + Date.now() })}
                    />
                    <ActionRow
                      label="Toggle Site Status"
                      action="toggleSiteStatus"
                      disabled={!siteId}
                      onClick={() => api.toggleSiteStatus(Number(siteId))}
                    />
                    <ActionRow
                      label="Unregister Site"
                      action="deleteSite"
                      variant="destructive"
                      disabled={!siteId}
                      onClick={() => api.deleteSite(Number(siteId))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* STATS & ANALYTICS TAB */}
              <TabsContent value="stats" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard & Analytics</CardTitle>
                    <CardDescription>Performance metrics across the platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ActionRow
                      label="Global Dashboard Stats"
                      action="getAdminStats"
                      description="Fetch top-level aggregated stats for the dashboard"
                      onClick={() => api.getAdminStats()}
                    />
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Analytics Overviews</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => run("getAdminAnalytics-7d", () => api.getAdminAnalytics({ period: "7d" }))}>
                          Last 7 Days
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => run("getAdminAnalytics-30d", () => api.getAdminAnalytics({ period: "30d" }))}>
                          Last 30 Days
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => run("getAdminAnalytics-3m", () => api.getAdminAnalytics({ period: "3m" }))}>
                          Last 3 Months
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => run("getAdminAnalytics-1y", () => api.getAdminAnalytics({ period: "1y" }))}>
                          Last Year
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* MORE / ASSETS TAB */}
              <TabsContent value="more" className="space-y-4 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Management</CardTitle>
                    <CardDescription>File uploads and media handling.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 p-4 border rounded-lg bg-card">
                      <p className="text-sm font-medium">Upload Article Image</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="text-xs text-muted-foreground file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const file = fileInputRef.current?.files?.[0];
                          if (!file) {
                            setLastResult({ action: "upload", ok: false, payload: "No file selected" });
                            return;
                          }
                          run("uploadArticleImage", () => api.uploadArticleImage(file));
                        }}
                      >
                        Upload Selected File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 self-start space-y-4">
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Last Execution</CardTitle>
                {lastResult && (
                  <Badge variant={lastResult.ok ? "secondary" : "destructive"}>
                    {lastResult.ok ? "Success" : "Error"}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {lastResult ? lastResult.action : "Waiting for action trigger..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-lg border bg-muted/30 dark:bg-muted/10 p-4 font-mono text-[11px] overflow-auto max-h-[500px]">
                {lastResult ? (
                  <pre className="whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(lastResult.payload, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-40">
                    <div className="text-4xl mb-2">⚡</div>
                    <p>Select an API service to run</p>
                  </div>
                )}
              </div>
              {lastResult && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLastResult(null)}
                  className="w-full mt-4 text-xs font-normal"
                >
                  Clear Result
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-[12px] space-y-2 text-muted-foreground">
              <p>• Make sure to login first via the Auth tab to populate the session.</p>
              <p>• Check the browser console for more detailed error logs if a request fails.</p>
              <p>• IDs for specific actions can be found by listing articles or sites first.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}