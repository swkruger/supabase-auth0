import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: "https://fifolio.app.com/",
    scope: "openid profile email read:roles",
  },
});