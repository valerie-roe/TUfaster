import { delay } from "@/utils/queryDOM";
import { defaultLogin, defaultFillOTP, parseError } from "./default";

export interface LoginSites {
	login: (
		creds: UserCredentials,
		logout_cb: () => void,
	) => Promise<void | LoginError>;
	findError: () => LoginError | undefined;
	matches: Array<string>;
	platform?: CredentialsPlatform;
}

export enum LoginError {
	WRONG_CREDS = "wrong credentials",
	NO_TOKEN = "no valid token available",
	UNKNOWN = "unknown login error",
	RATE_LIMIT = "too many attempts, try again later",
	TIMEOUT = "timed out",
}

export const sites = {
	idp: {
		matches: ["https://idp.tu-dresden.de/*"],

		login: async (creds) => {
			if (await defaultLogin(creds)) return;
			if (await defaultFillOTP()) return;
			// one of the two above should work, so at this point something is going wrong
			return LoginError.UNKNOWN;
		},

		findError: () => {
			const elem = q(".output--error") ?? q('.content p font[color="red"]');
			if (elem) return parseError(elem.innerText);
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

	eLearning: {
		matches: ["https://elearning.med.tu-dresden.de/moodle/login/index.php"],

		login: async () => q('a[href*="auth/shibboleth"]')?.click(),

		findError: () => {},
	},

	ePortal: {
		matches: ["https://eportal.med.tu-dresden.de/*"],

		login: async () => q("#personaltools-login")?.click(),

		findError: () => {},
	},

	gitLab: {
		matches: ["https://git.imld.de/*", "https://gitlab.mn.tu-dresden.de/*"],

		login: async (creds) => {
			console.log("RUNNIGN");
			q('a[data-qa-selector="ldap_tab"][role="tab"]')?.click(); // switch to ZIH login

			console.log("1");
			const checkbox = q<HTMLInputElement>("#ldapmain_remember_me");
			console.log(checkbox);
			if (checkbox) checkbox.checked = true;
			console.log("2");

			defaultLogin(creds, "#ldapmain_username", "#ldapmain_password");
			console.log("3");
		},

		findError: () => {
			const elem = q('.flash-alert[data-testid="alert-danger"]');
			if (elem) return parseError(elem.innerText);
		},
	},

	selma: {
		matches: ["https://selma.tu-dresden.de/*"],

		login: async (creds) => {
			defaultLogin(creds, "#field_user", "#field_pass", "#logIn_btn");
		},

		findError: () => {
			const elem = q("h1", q(".pageContent"));
			if (!elem) return;
			const error = elem.innerText.toLowerCase();

			if (error.includes("willkommen") || error.includes("welcome")) return;

			return parseError(error);
		},
	},

	matrix: {
		matches: ["https://matrix.tu-dresden.de/*"],

		login: async (creds) => {
			await delay(300);
			const loginButton = q('a[href="#/login"]');
			if (!loginButton) throw Errors.DOM_FIND;

			loginButton.click();
			await delay(300);

			const res = defaultLogin(
				creds,
				"#mx_LoginForm_username",
				"#mx_LoginForm_password",
				'input.mx_Login_submit[type="submit"]',
			);

			if (res) return;

			return LoginError.UNKNOWN;
		},

		findError: () => {
			const elem = q(".mx_Login_error");
			if (elem) return parseError(elem.innerText);
		},
	},

	slub: {
		matches: ["https://*.slub-dresden.de/*"],
		platform: "slub",

		login: async (creds) => {
			(q('a[title="Anmelden"]') ?? q('a[title="Anmelden"]'))?.click();

			defaultLogin(creds, "#txtUsername", "#txtPassword", "#btnLogin");
		},

		findError: () => {
			// TODO still buggy
			const elem = q(".form-error");
			if (elem) return parseError(elem.innerText);
		},
	},

	tex: {
		matches: ["https://tex.zih.tu-dresden.de/*"],

		login: async () => {
			q<HTMLAnchorElement>('a[href="/saml/login/go"]')?.click();
		},

		findError: () => {},
	},

	videocampus: {
		matches: ["https://videocampus.sachsen.de/*"],

		login: async () => {
			const loginButon = q('a[href="/login"]');
			loginButon?.click();

			const select = q<HTMLSelectElement>('select[name="idp"]');
			if (!select) throw Errors.DOM_FIND;

			const option = Array.from(select.options).find(
				(option) =>
					option.innerText === "TU Dresden" ||
					option.innerText === "Technische Universität Dresden",
			);
			if (!option) throw Errors.DOM_FIND;

			select.value = option.value;
			// The onchange handler has to be triggered manually
			select.dispatchEvent(new Event("change"));

			q("#samlLogin")?.click();
		},

		findError: () => {},
	},
} as const satisfies Record<string, LoginSites>;

// "https://bildungsportal.sachsen.de/opal/*", already handled?
// "https://se-gitlab.inf.tu-dresden.de/*" not reachable, maybe also deprecated?
