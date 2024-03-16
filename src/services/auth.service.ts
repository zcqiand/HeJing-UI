import { UserManager, WebStorageStateStore, User } from "oidc-client-ts"

export default class AuthService {
	private userManager: UserManager

	constructor() {
		const IdentityServer: string = "https://localhost:7216"
		const AppServer: string = "http://localhost:3305"

		const settings: any = {
			userStore: new WebStorageStateStore({ store: window.localStorage }),
			authority: IdentityServer,
			client_id: "vuejs_code_client",
			redirect_uri: `${AppServer}/callback.html`,
			automaticSilentRenew: true,
			silent_redirect_uri: `${AppServer}/silent-renew.html`,
			response_type: "code",
			scope: "openid offline_access",
			post_logout_redirect_uri: AppServer,
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
