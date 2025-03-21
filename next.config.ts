import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_REDIRECT_URI: process.env.AUTH0_REDIRECT_URI,
    AUTH0_POST_LOGOUT_REDIRECT_URI: process.env.AUTH0_POST_LOGOUT_REDIRECT_URI
  }
};

export default nextConfig;
