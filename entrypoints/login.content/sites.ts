import { defaultLogin, defaultFillOTP } from "./default";

export interface LoginSites {
	login: (
creds: UserCredentials,
logout_cb: () => void,
) => Promise<void | LoginError>;
	findError: () => LoginError | undefined;
	matches: Array<string>;
}

export enum LoginError {
	WRONG_CREDS = "wrong credentials",
	NO_TOKEN = "no valid token available",
	OTHER = "unknown login error",
}

export const sites = {
	idp: {
		matches: ["https://idp.tu-dresden.de/*"],

		login: async (creds) => {
			if (await defaultLogin(creds)) return;
			if (await defaultFillOTP()) return;
			// one of the two above should work, so at this point something is going wrong
			return LoginError.OTHER;
		},

		findError: () => {
			const elem = q(".output--error") ?? q('.content p font[color="red"]');
			if (!elem) return;
			const error = elem.innerText;
			switch (error) {
				case "Wrong username or password.":
					return LoginError.WRONG_CREDS;
				case "Authentication failed, no valid token available.":
					return LoginError.NO_TOKEN;
				default:
					return LoginError.OTHER;
			}
		},
	},

	opalShibboleth: {
		matches: [
			"https://bildungsportal.sachsen.de/opal/shiblogin*",
			"https://bildungsportal.sachsen.de/opal/login*",
		],

		login: async (_) => {
			const select = q<HTMLSelectElement>('select[name="wayfselection"]'); // "id2" seems to be random generated, so we should probably not use it
			if (!select) throw Errors.DOM_FIND;

			const option = Array.from(select.options).find(
				(option) =>
					option.innerText === "TU Dresden" ||
					option.innerText === "Technische Universität Dresden",
			);

			if (!option) throw Errors.DOM_FIND;

			select.value = option.value;

			q('button[name="shibLogin"]')?.click();
					},

		findError: () => {},
	},
} as const satisfies Record<string, LoginSites>;
