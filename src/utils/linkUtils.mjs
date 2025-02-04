export function ensureTrailingSlash(url) {
    return url && !url.endsWith('/') ? url + '/' : url
}