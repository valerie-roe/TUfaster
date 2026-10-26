export const useChrome = () => ({
    setChromeLocalStorage,
    getChromeLocalStorage,
    removeChromeLocalStorage,
    sendChromeRuntimeMessage
})

const setChromeLocalStorage = async (items: { [key: string]: any }) => await browser.storage.local.set(items)

const getChromeLocalStorage = async (keys: string | string[]) => {
    if (typeof keys === 'string') {
        const { [keys]: response } = await browser.storage.local.get(keys)
        return response
    } else {
        return await browser.storage.local.get(keys)
    }
}

const removeChromeLocalStorage = async (keys: string | string[]) => await browser.storage.local.remove(keys)

const sendChromeRuntimeMessage = async (cmd: any) => await browser.runtime.sendMessage(cmd)
