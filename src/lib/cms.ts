/** Shared CMS client helpers for the public homepage (DB-driven, bilingual). */
import { useEffect, useState } from "react";

export interface CmsProject {
  id: string;
  status: string;
  year: string;
  platform: string;
  distributionUrl: string | null;
  bannerKey: string | null;
  sortOrder: number;
  isFlagship: boolean;
  title: string;
  typeLabel: string;
  description: string;
  culturalNote: string;
  thumbnails: string[];
}

export interface CmsNews {
  id: string;
  status: string;
  coverKey: string | null;
  publishedAt: string | null;
  title: string;
  excerpt: string;
  body: string;
}

export interface CmsMilestone {
  id: string;
  yearLabel: string;
  kind: string;
  badgeText: string;
  sortOrder: number;
  title: string;
  org: string;
  description: string;
}

export interface SiteFacts {
  facts: Record<string, { value: string; mode: string }>;
  channels: Array<{ key: string; value: string; label: string; isLink: boolean; sortOrder: number }>;
  mediaBase: string;
}

let mediaBaseCache = "";

export function resolveMediaUrl(key: string | null | undefined, fallback = ""): string {
  if (!key) return fallback;
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) return key;
  if (mediaBaseCache) return `${mediaBaseCache}/${key}`;
  return fallback || key;
}

export function useSite(): SiteFacts | null {
  const [site, setSite] = useState<SiteFacts | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || cancelled) return;
        if (d.mediaBase) mediaBaseCache = d.mediaBase;
        setSite(d);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return site;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export function useCmsList<T>(url: string | null): { data: T[] | null; reload: () => void } {
  const [data, setData] = useState<T[] | null>(null);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    getJson<{ projects: T[] } | { news: T[] } | { milestones: T[] }>(url).then((d) => {
      if (!d || cancelled) return;
      const list = (d as { projects?: T[]; news?: T[]; milestones?: T[] }).projects
        ?? (d as { news?: T[] }).news
        ?? (d as { milestones?: T[] }).milestones
        ?? null;
      setData(list);
    });
    return () => {
      cancelled = true;
    };
  }, [url, nonce]);
  return { data, reload: () => setNonce((n) => n + 1) };
}
