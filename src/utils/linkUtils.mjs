/**
 * Ensures that the given URL has a trailing slash.
 * @param {string} url - The URL to ensure has a trailing slash.
 * @returns {string} - The URL with a trailing slash.
 */
export function ensureTrailingSlash (url) {
  return url && !url.endsWith('/') ? url + '/' : url
}
