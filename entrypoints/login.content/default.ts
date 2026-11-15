import { LoginError } from "./sites";

export function defaultLogin(
	creds: UserCredentials,
	usernameQuery: string = "#username",
	passwordQuery: string = "#password",
	submitQuery: string = 'button[type="submit"]',
): boolean {
	const usernameInput = q<HTMLInputElement>(usernameQuery);
	const passwordInput = q<HTMLInputElement>(passwordQuery);
	const submitButton = q(submitQuery);

	if (!usernameInput || !passwordInput || !submitButton) return false;

	fakeInput(usernameInput, creds.username);
	fakeInput(passwordInput, creds.password);
	submitButton.click();

	return true;
}

export async function defaultFillOTP(
	inputQuery: string = "#fudis_otp_input",
	submitQuery: string = 'button[name="_eventId_proceed"][type="submit"]',
): Promise<boolean> {
	const otpInput = q<HTMLInputElement>(inputQuery);
	const OTPsubmitButton = q(submitQuery);

	if (!otpInput || !OTPsubmitButton) return false;

	const indexesText = otpInput.parentElement?.parentElement?.parentElement
		?.querySelector("div:first-of-type")
		?.textContent?.trim();
	//                            find number & number | remove whole match | to numbers | to zero based (first index is 0)
	const indexes = indexesText
		?.match(/(\d+) & (\d+)/)
		?.slice(1, 3)
		.map((x) => Number.parseInt(x, 10) - 1);

	const OTPType = indexesText?.toLocaleLowerCase().includes("totp")
		? "totp"
		: "iotp";

	fakeInput(
		otpInput,
		await retrieveOTP(
			OTPType,
			indexes && indexes.length > 0 ? indexes : undefined,
		),
	);

	OTPsubmitButton.click();
	return true;
}

/**
 * Navigates the shiboleth WAYF-Selection flow
 * @returns `true` if successfull, `false` if no Dropdown present
 * @throws on flow internal mismatch
 */
export function defaultWayfLogin(): boolean {
	const select = q<HTMLSelectElement>('select[name*="wayfselection"]');
	if (!select) return false;

	const option = Array.from(select.options).find(
		(option) =>
			option.innerText === "TU Dresden" ||
			option.innerText === "Technische Universität Dresden",
	);

	if (!option) throw Errors.DOM_FIND;

	select.value = option.value;

	qMust('button[name*="shibLogin"]').click();
	return true;
}

export function parseError(text: string): LoginError {
	const e = text.toLowerCase();
	switch (true) {
		case e.includes("passwort") && e.includes("falsch"):
		case (e.includes("password") || e.includes("credentials")) &&
			(e.includes("wrong") || e.includes("invalid")):
			return LoginError.WRONG_CREDS;

		case e.includes("no valid token available"):
			return LoginError.NO_TOKEN;

		case e.includes("zur Zeit nicht möglich"):
			return LoginError.RATE_LIMIT;

		default:
			return LoginError.UNKNOWN;
	}
}
