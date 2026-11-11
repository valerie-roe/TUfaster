import type { UserData } from "@/lib/credentials";
import { getUserData } from "@/lib/credentials";

export type OTPType = "totp" | "iotp";

export async function retrieveOTP(type: OTPType, indexes?: number[]): string {
	const otp: undefined | undefined = await browser.runtime.sendMessage({
		cmd: "get_totp",
	});

	if (otp == undefined) throw Errors.INTERNAL;

	return otp;
}

export interface UserCredentials {
	username: string;
	password: string;
}

export async function retrieveCredentials(): Promise<UserCredentials> {
	const creds = await browser.runtime.sendMessage({
		cmd: "get_user_data",
	});
	if (creds.pass == undefined || creds.user == undefined) throw Errors.INTERNAL;

	return {
		username: creds.user,
		password: creds.pass,
	};
}
