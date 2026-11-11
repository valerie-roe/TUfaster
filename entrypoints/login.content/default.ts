export async function defaultLoginFlow(
	creds: UserCredentials,
	usernameQuery: string = "#username",
	passwordQuery: string = "#password",
	submitQuery: string = 'button[type="submit"]',
	otpQuery: string = "#fudis_otp_input",
	submitOTPQuery: string = 'button[name="_eventId_proceed"][type="submit"]',
): Promise<boolean> {
	const usernameInput = q<HTMLInputElement>(usernameQuery);
	const passwordInput = q<HTMLInputElement>(passwordQuery);
	const submitButton = q(submitQuery);

	const otpInput = q<HTMLInputElement>(otpQuery);
	const OTPsubmitButton = q(submitOTPQuery ?? submitQuery);

	// same logic reruns on path change, so we need to differenciate which step is neccessary
	if (usernameInput && passwordInput && submitButton) {
		fakeInput(usernameInput, creds.username);
		fakeInput(passwordInput, creds.password);
		submitButton.click();

		return true;
	} else if (otpInput && OTPsubmitButton) {
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
			retrieveOTP(OTPType, indexes && indexes.length > 0 ? indexes : undefined),
		);

		OTPsubmitButton.click();
		return true;
	}
	return false;
}
