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
