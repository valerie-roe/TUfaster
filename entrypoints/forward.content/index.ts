import { sites } from "./sites"

export default defineContentScript({
    matches: [
        "https://www.google.de/search?*q=*",
        "https://www.google.com/search?*q=*",
        "https://duckduckgo.com/?*q=*",
        "https://www.ecosia.org/search?*q=*",
        "https://www.bing.com/search?*q=*",
        "https://www.startpage.com/do/search?*q=*",
        "https://www.startpage.com/do/search?*query=*",
        "https://www.startpage.com/sp/search?*q=*",
        "https://www.startpage.com/sp/search?*query=*",
        "https://www.qwant.com/?*q=*",
        "https://search.brave.com/search?*q=*",
        "https://kagi.com/search?*q=*"
    ],

    runAt: "document_start",

    async main(ctx) {
        const { fwdEnabled } = await browser.storage.local.get(['fwdEnabled'])
        if (!fwdEnabled) return

        // This fetches the q-query from the URL
        // Basically every SE just uses this parameter when using GET
        // Startpage sometimes uses 'query' instead of 'q' but we can handle this here too
        const params = new URLSearchParams(window.location.search)
        const keyword = (params.get('q') || params.get('query'))?.toLowerCase()

        // TODO handle Startpage (no ?q) & qwant (SPA; seems to work)

        if (!keyword || !(keyword in sites)) return

        const url = sites[keyword as keyof typeof sites].url

        console.log(`Forwarding to ${keyword} (${url})`)
        browser.runtime.sendMessage({ cmd: 'save_clicks', click_count: 1 }) // We don't need to wait for any (useless) response
        window.location.replace(url)
    }
})