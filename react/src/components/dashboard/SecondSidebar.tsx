import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HEALTH_EMERGENCY_NUMBERS, HEALTH_TIPS } from "../../constants";

type HealthArticle = {
  title: string;
  link: string;
  pubDate?: string;
  source?: string;
  source_name?: string;
};

type NewsResponse = {
  articles?: unknown;
};

type CachedNews = {
  fetchedAt: number;
  articles: HealthArticle[];
};

const NEWS_CACHE_KEY = "medi-ai-health-news-v1";
const NEWS_CACHE_TTL = 30 * 60 * 1000;
const NEWS_REFRESH_INTERVAL = 6 * 1000;
const TIPS_REFRESH_INTERVAL = 8 * 1000;
const apiBaseUrl = (
  import.meta.env.VITE_PHP_API_URL || "http://localhost:8083"
).replace(/\/$/, "");

function parseArticles(value: unknown): HealthArticle[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): HealthArticle[] => {
    if (!item || typeof item !== "object") return [];
    const article = item as Record<string, unknown>;
    if (typeof article.title !== "string" || typeof article.link !== "string")
      return [];

    try {
      const url = new URL(article.link);
      if (url.protocol !== "http:" && url.protocol !== "https:") return [];
    } catch {
      return [];
    }

    return [
      {
        title: article.title,
        link: article.link,
        pubDate:
          typeof article.pubDate === "string" ? article.pubDate : undefined,
        source: typeof article.source === "string" ? article.source : undefined,
        source_name:
          typeof article.source_name === "string"
            ? article.source_name
            : undefined,
      },
    ];
  });
}

function getDailyTipIndex(): number {
  const today = new Date();
  const dayNumber = Math.floor(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) /
      86_400_000,
  );
  return (dayNumber * 2) % HEALTH_TIPS.length;
}

function formatArticleDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function SecondSidebar() {
  const shouldReduceMotion = useReducedMotion();
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsIndex, setNewsIndex] = useState(0);
  const [newsHovered, setNewsHovered] = useState(false);
  const [tipIndex, setTipIndex] = useState(getDailyTipIndex);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const cached = sessionStorage.getItem(NEWS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Partial<CachedNews>;
          if (
            typeof parsed.fetchedAt === "number" &&
            Date.now() - parsed.fetchedAt < NEWS_CACHE_TTL &&
            Array.isArray(parsed.articles)
          ) {
            const cachedArticles = parseArticles(parsed.articles);
            if (cachedArticles.length > 0) {
              setArticles(cachedArticles);
              setNewsLoading(false);
              return;
            }
          }
        }
      } catch {
        // Storage can be unavailable in private browsing; fetch normally.
      }

      try {
        const response = await fetch(`${apiBaseUrl}/news.php`);
        if (!response.ok) throw new Error("News request failed");
        const payload = (await response.json()) as NewsResponse;
        const nextArticles = parseArticles(payload.articles);
        if (nextArticles.length === 0)
          throw new Error("News response is empty");

        if (!cancelled) {
          setArticles(nextArticles);
          try {
            const value: CachedNews = {
              fetchedAt: Date.now(),
              articles: nextArticles,
            };
            sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(value));
          } catch {
            // The component remains usable when session storage is unavailable.
          }
        }
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    }

    void loadNews();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (newsHovered || articles.length < 2) return;
    const intervalId = window.setInterval(() => {
      setNewsIndex((current) => (current + 1) % articles.length);
    }, NEWS_REFRESH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [articles.length, newsHovered]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTipIndex((current) => (current + 2) % HEALTH_TIPS.length);
    }, TIPS_REFRESH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, []);

  const visibleArticles =
    articles.length === 0
      ? []
      : [
          articles[newsIndex],
          ...(articles.length > 1
            ? [articles[(newsIndex + 1) % articles.length]]
            : []),
        ];
  const visibleTips = [
    HEALTH_TIPS[tipIndex],
    HEALTH_TIPS[(tipIndex + 1) % HEALTH_TIPS.length],
  ];

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col gap-3 overflow-hidden border-l border-[#e1eae5] bg-[#f7f9f8] p-3 lg:flex">
      <section className="flex min-h-0 shrink-0 flex-col rounded-lg border border-red-200 bg-red-50 p-3 text-red-950">
        <h2 className="mb-2 truncate font-Inter text-sm font-semibold">
          Emergency numbers
        </h2>
        <ul className="flex flex-col gap-1.5">
          {HEALTH_EMERGENCY_NUMBERS.map((item) => (
            <li
              key={item.country}
              className="flex min-w-0 items-start gap-2 text-xs leading-4"
            >
              <span className="shrink-0" aria-hidden="true">
                {item.flag}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.country}</span>
              <span className="max-w-36 text-right font-semibold leading-4">
                {item.number}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-red-800">
          If you are in danger, call your local emergency number now.
        </p>
      </section>

      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#dce7e1] bg-white p-3"
        onMouseEnter={() => setNewsHovered(true)}
        onMouseLeave={() => setNewsHovered(false)}
        aria-label="Health news"
      >
        <h2 className="mb-2 shrink-0 truncate font-Inter text-sm font-semibold text-[#253c34]">
          Health news
        </h2>
        {newsLoading ? (
          <div className="space-y-3" aria-label="Loading health news">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="space-y-2 rounded-md bg-[#f5f8f6] p-2.5"
              >
                <div className="h-3 w-4/5 animate-pulse rounded bg-[#dce7e1]" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-[#e7efeb]" />
              </div>
            ))}
          </div>
        ) : visibleArticles.length === 0 ? (
          <p className="text-xs text-[#687b75]">
            News is unavailable right now
          </p>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={newsIndex}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: "easeOut",
              }}
              className="flex min-h-0 flex-col gap-2 overflow-hidden"
            >
              {visibleArticles.map((article, index) => (
                <a
                  key={`${article.link}-${index}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 rounded-md bg-[#f5f8f6] p-2.5 transition-colors hover:bg-[#edf4f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087e68]"
                >
                  <span className="line-clamp-2 wrap-break-word text-xs font-medium leading-4 text-[#253c34]">
                    {article.title}
                  </span>
                  <span className="mt-1 flex min-w-0 items-center justify-between gap-2 text-[10px] leading-4 text-[#687b75]">
                    <span className="truncate">
                      {article.source_name || article.source || "Health news"}
                    </span>
                    {formatArticleDate(article.pubDate) && (
                      <time className="shrink-0">
                        {formatArticleDate(article.pubDate)}
                      </time>
                    )}
                  </span>
                </a>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#dce7e1] bg-white p-3">
        <h2 className="mb-2 shrink-0 truncate font-Inter text-sm font-semibold text-[#253c34]">
          Health tips
        </h2>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tipIndex}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              ease: "easeOut",
            }}
            className="flex min-h-0 flex-col gap-2 overflow-hidden"
            aria-live="polite"
          >
            {visibleTips.map((tip, index) => (
              <p
                key={`${tipIndex}-${index}`}
                className="line-clamp-3 rounded-md bg-[#f5f8f6] p-2.5 text-xs leading-5 text-[#40564d]"
              >
                {tip}
              </p>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>
    </aside>
  );
}
