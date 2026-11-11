export type OTPType = "totp" | "iotp";

export function retrieveOTP(type: OTPType, indexes?: number[]): string {
	return "";
}

export interface UserCredentials {
	username: string;
	password: string;
}

export function retrieveCredentials(): UserCredentials {
	return { password: "", username: "" };
}
