export type URLPattern = string;
export type URL = string;

type Site<T> = T & { matches: Array<URLPattern> };
type SiteName = string;
type Sites<T = {}> = Record<SiteName, Site<T>>;

export function matches(
	pattern: URLPattern,
	url: URL = window.location.href,
): boolean {
	const matcher = new MatchPattern(pattern);

	return matcher.includes(url);
}

export function collectMatches(sites: Sites): Array<URLPattern> {
	return Object.values(sites).flatMap((site) => site.matches);
}

export function matches_any(
	patterns: Array<URLPattern>,
	url: URL = window.location.href,
): boolean {
	return patterns.some((pattern) => matches(pattern, url));
}

/**
 * Returns the site entry that we are currently on.
 */
export function match_site<T>(
	sites: Sites<T>,
): [SiteName, Site<T>] | undefined {
	return Object.entries(sites).find((site) => matches_any(site[1].matches));
}

/** Utility to match only the `Path` of a URL using "absolute" or "relative" patterns
 *  Patterns prefixed by `/` are "absolute", meaning they only match the full path
 *  Patterns without leading `/` are "relative", meaning they will match if the path just contains the pattern
 */
export function pathPattern(pattern: URLPattern): URLPattern {
	if (pattern.includes("://")) return pattern;

	const path = pattern.startsWith("/") ? pattern : `/*${pattern}`;

	return `*://*${path}`;
}
