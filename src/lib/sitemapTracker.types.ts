export interface SitemapTrackerLink {
  link: string;
  sourceSitemap: string | null;
  lastModifiedAt: string | null;
}

export interface SitemapTrackerResponse {
  sitemapUrl: string;
  lookbackDays: number;
  hasConfiguredSitemap: boolean;
  currentLinkCount: number;
  recentLinksCount: number;
  fetchedAt: string | null;
  missingLastModifiedCount: number;
  lastError: string | null;
  links: SitemapTrackerLink[];
}
