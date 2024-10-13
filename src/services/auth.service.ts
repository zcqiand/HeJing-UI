import { UserManager, WebStorageStateStore, User } from "oidc-client"

export default class AuthService {
	private userManager: UserManager

	constructor() {
		const settings: any = {
			userStore: new WebStorageStateStore({ store: window.localStorage }),
			authority: import.meta.env.VITE_IDENTITY_URL,
			client_id: `${import.meta.env.VITE_CLIENT_ID}`,
			redirect_uri: `${import.meta.env.VITE_APP_APP_URL}/callback.html`,
			automaticSilentRenew: true,
			silent_redirect_uri: `${import.meta.env.VITE_APP_APP_URL}/silent-renew.html`,
			response_type: `${import.meta.env.VITE_GRANT_TYPE}`,
			scope: "openid offline_access",
			post_logout_redirect_uri: `${import.meta.env.VITE_APP_APP_URL}/`,
			filterProtocolClaims: true
		}

		this.userManager = new UserManager(settings)
	}

	public getUser(): Promise<User | null> {
		return this.userManager.getUser()
	}

	public login(): Promise<void> {
		return this.userManager.signinRedirect()
	}

	public logout(): Promise<void> {
		return this.userManager.signoutRedirect()
	}

	public getAccessToken(): Promise<string> {
		return this.userManager.getUser().then((data: any) => {
			return data.access_token
		})
	}
}
