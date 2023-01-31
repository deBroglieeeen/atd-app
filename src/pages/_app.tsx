import "../styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthorizedUrqlProvider } from "../components/AuthorizedUrqlProvider";
import {
  AUTH0_API_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_REDIRECT_URI,
} from "../config/server";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      audience={AUTH0_API_AUDIENCE}
      redirectUri={AUTH0_REDIRECT_URI}
    >
      <ChakraProvider>
        <AuthorizedUrqlProvider>
          <Component {...pageProps} />
        </AuthorizedUrqlProvider>
      </ChakraProvider>
    </Auth0Provider>
  );
}

export default MyApp;
