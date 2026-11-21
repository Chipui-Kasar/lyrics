# SEO & Speed Audit: tangkhullyrics.com vs tangkhullaa.com

Date: 21 Nov 2026

How this was done: I fetched both live sites (pages, sitemaps, robots.txt, response headers), ran Lighthouse 12.6 on mobile against both, and read through this codebase.

## Summary

The competitor is **not** on top because their site is faster. Speed counts for a little, and it's worth fixing, but it won't get you to #1 by itself. The bigger reasons are duplicate content, domain age, keyword match and links from other sites (details below).

## What was measured (Lighthouse, mobile)

| Page | Your score / LCP | Competitor's score / LCP |
|---|---|---|
| Homepage | 72 / **5.8s** | 90 / 3.2s |
| Same song ("Avawui leikashi") | 87 / 3.6s | 90 / 2.1s |
| Artist page | 80 / **4.7s** | — |
| Lyrics in sitemap | **501** | 338 (272 of them are the same songs as yours) |
| Site first seen online (Wayback Machine) | Feb 2025 | **Dec 2021** |

LCP is how long the main content takes to appear. Both sites score 100 on Lighthouse's basic SEO checks. The competitor's site is built on Wix and is technically weaker than this one, but it still ranks higher.

Other numbers:
- Your homepage HTML is 242KB, with about 123KB of inline React data, 91 images and 37 script files (487KB).
- Your server response time (TTFB) is about 450–580ms even when Vercel serves the page from its cache.
- The competitor's homepage HTML is 55KB. Lighthouse measured their root document at 70ms.

## Why they rank above you

1. **Your lyrics are word-for-word the same as theirs, and theirs were online first.** I compared the song text directly and it's identical. When Google finds the same text in two places, it usually picks the older, more established page as the original and pushes the other one down. This is the biggest factor.
2. **Their domain is older and has more links pointing to it.** About 5 years versus about 1.75 years.
3. **Their name matches what people search.** "Tangkhul laa" is a common search phrase and it's literally their domain. Your titles never use the word "laa".
4. **You have more songs, but nothing on each song page that they don't also have.** It's the same lyrics on both sites, so Google has no reason to prefer yours.

## Speed problems in the code

1. **Homepage LCP of 5.8s is caused by the banner carousel.** `PromotionalBanner.tsx` switches to slide 2 ("🎤 Submit Your Lyrics & Win Prizes!") after 5 seconds. That new, larger headline counts as a fresh "main content" paint, so Google measures the page as finishing at 5.8s. Make the banner a single static slide, or remove it.
2. **Artist and lyric pages replace their own content after loading.** `ArtistsSongLists.tsx:21-52` and `Lyrics.tsx:21-40` fetch the same data again in the browser and re-render text the server already sent. That re-render is why the artist page's main content shows up after about 4 seconds. The server-rendered HTML is already up to date, so these browser-side refetches can be removed.
3. **Every visit downloads a lot in the background.**
   - `ArtistPrecacher` fetches every artist page (about 92 pages, roughly 5MB).
   - `CacheInitializer` syncs lyric and artist data.
   - Every song link on artist pages preloads its page (`prefetch={true}`), and so do the main navigation links.

   On mobile data in India, this competes with the page the visitor actually opened. Google ranks you using real visitors' speed, so this hurts. Remove the precacher, and only run the cache sync on the search page.
4. **The custom `webpack` setup in `next.config.mjs` makes loading slower.** It splits Next.js into 17 separate files, so the browser downloads 37 script files (487KB). It also sets `sideEffects: false` for the whole project, which is risky because it can drop code that's needed. Delete that whole `webpack` block. Also take `react`, `react-dom`, `next/image` and `next/link` out of `optimizePackageImports`.
5. **Cloudflare is sitting in front of Vercel.** The response headers show the request going through Cloudflare and then Vercel, and Cloudflare isn't caching it. Vercel recommends switching Cloudflare to "DNS only" (grey cloud) for sites hosted on Vercel.
6. **The homepage is heavy.** Show about 20 popular artists instead of all 92 (with photos), and link to `/allartists` for the rest. Also cut the Inter font from 4 weights plus italic down to 2.
7. **Smaller items:**
   - Two CSS files block rendering for about 1 second.
   - `SessionProvider` wraps the whole site, so every page view calls `/api/auth/session`.

## SEO fixes in the code

1. **Your homepage heading is hidden.** The `<h1>` uses `sr-only`, so visitors and Google see almost no descriptive text. The competitor has a visible paragraph. Add a visible heading and a 150–300 word intro that naturally uses phrases like "Tangkhul laa", "Tangkhul song lyrics" and "Tangkhul gospel songs".
2. **Song page titles.** Change them to something like `Avawui Leikashi Lyrics – K Free Themreichan | Tangkhul Laa`.
3. **Give each song page something the competitor doesn't have.** This is how you win long term:
   - English translation or meaning
   - the story behind the song
   - the YouTube video
   - "More songs by this artist" and related songs, which also helps Google crawl your site
4. **Fix descriptions that aren't true.**
   - Your description says "1000+" lyrics, but you have about 500.
   - Your keywords and descriptions repeat "lyrics translation", but the pages have no translations.
   - Song pages show "Release Date: 2026" because they use the date the song was added to your database. The structured data also lists the singer as composer and lyricist without knowing that.

   Google can penalise inaccurate claims, so remove anything you can't back up.
5. **Duplicate and broken pages.**
   - `/lyrics/.../details` repeats the lyric page and declares itself the original. Point it at the main lyric page or delete it.
   - The root layout (`src/app/layout.tsx`, `alternates.canonical`) sets the homepage as the "original" for every page, so pages without their own setting inherit that. For example, `/lyrics/page/2` declares itself a copy of the homepage. Remove that setting.
   - `/lyrics/page/N` answers with a normal page plus an in-page redirect instead of a real redirect, because the root layout forces static rendering. Move it to `redirects()` in `next.config.mjs`.
   - `www.tangkhullyrics.com` uses a temporary redirect (307). Make it permanent (308) in Vercel's domain settings.
   - The search page can be indexed and is in your sitemap. Block it from indexing and remove it from the sitemap.
   - robots.txt is defined twice (`public/robots.txt` and `src/app/robots.ts`), and it blocks `/_next/` for general bots. Keep one file and remove the `/_next/` block.

## Work outside the code

- **Google Search Console:** open the Page indexing report and look for "Duplicate, Google chose different canonical than user". If your song pages show up there, that confirms point 1 under "Why they rank above you".
- **Links to your site:** ask artists to put your lyric link in their YouTube video descriptions. Post in Tangkhul Facebook groups, and get listed on Ukhrul and Tangkhul community sites. This is how you close the gap on domain age.
- **Open question:** your contact email is `tangkhullaalyrics@gmail.com` (in `Contact.tsx:82` and `src/app/api/ai-chat/route.ts`). If you have any connection to tangkhullaa.com, permanently redirecting that site to yours would pass most of its ranking to you. That would do more than everything else here combined.

## Priority order

Nobody can guarantee the #1 spot. The best order is:

1. Content changes (translations, song stories, related songs)
2. Links from other sites
3. Speed fixes and the remaining technical SEO fixes
