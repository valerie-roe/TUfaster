export default function fakeInput(input: HTMLInputElement, value: string) {
    // Inspired by how the Bitwarden extension does it
    // https://github.com/bitwarden/clients/blob/master/apps/browser/src/content/autofill.js#L346
    input.getBoundingClientRect()

    // Click it
    input.click()

    // Focus it
    input.focus()

    // Sending empty keypresses
    // Making it a local function so we can use it again later
    const sendEmptyPresses = () => {
        input.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: false,
                charCode: 0,
                keyCode: 0,
                which: 0
            })
        )
        input.dispatchEvent(
            new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: false,
                charCode: 0,
                keyCode: 0,
                which: 0
            })
        )
        input.dispatchEvent(
            new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: false,
                charCode: 0,
                keyCode: 0,
                which: 0
            })
        )
    }
    sendEmptyPresses()

    // Set value
    input.value = value

    // Click again
    input.click()

    // Send empty keypresses again
    sendEmptyPresses()

    // Other events
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))

    // Blur it
    input.blur()

    // Set value again
    input.value = value
}