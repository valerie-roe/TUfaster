export function isFirefox(): boolean {
    // TODO
    return false
}

export function getBrowserNetRequestPermissions(): string[] {
    return isFirefox() ? ['webRequest', 'webRequestBlocking'] : ['declarativeNetRequestWithHostAccess']
}
