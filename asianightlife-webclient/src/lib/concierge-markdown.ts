import { SITE_URL } from "@/lib/constants";

const SITE_HOST = new URL(SITE_URL).hostname;

/**
 * Gemini structured output sometimes returns literal `\n` instead of real newlines.
 * Also ensures list blocks parse correctly in Markdown.
 */
export function normalizeConciergeMarkdown(text: string): string {
  let result = text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t");

  // Blank line before numbered/bullet lists so ReactMarkdown parses them as lists.
  result = result.replace(/\n(\d+\.\s)/g, "\n\n$1");
  result = result.replace(/\n([-*]\s)/g, "\n\n$1");

  return result.trim();
}

/** Turn bare asianightlife.sg URLs into clickable Markdown links. */
export function linkifyConciergeMarkdown(text: string): string {
  return text.replace(
    /(?<!\]\()(?<!\()(?:https?:\/\/)?(?:www\.)?asianightlife\.sg(\/[\w-]*[\w/])?/gi,
    (_match, path: string | undefined) => {
      const pathname = path || "/";
      const href = `${SITE_URL.replace(/\/$/, "")}${pathname}`;
      return `[${labelForPath(pathname)}](${href})`;
    }
  );
}

function labelForPath(path: string): string {
  if (path === "/book") return "Book venues";
  if (path.startsWith("/guides/")) return "Read guide";
  if (path.endsWith("-nightlife")) {
    return path
      .slice(1, -"-nightlife".length)
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return `asianightlife.sg${path}`;
}

export function resolveConciergeHref(href: string): { internal: boolean; path: string } {
  if (href.startsWith("/")) {
    return { internal: true, path: href };
  }

  try {
    const url = new URL(href);
    if (url.hostname === SITE_HOST || url.hostname === "localhost") {
      return {
        internal: true,
        path: `${url.pathname}${url.search}${url.hash}`,
      };
    }
    return { internal: false, path: href };
  } catch {
    return { internal: false, path: href };
  }
}
