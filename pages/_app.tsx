import "@/styles/globals.css";
import type { AppProps } from "next/app";w
import { CookiesProvider } from "react-cookie";
import localFont from "@next/font/local";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";

// Create a client
const queryClient = new QueryClient();

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi/fonts/Satoshi-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <CookiesProvider>
          <div className={`${satoshi.variable}`}>
            <Component {...pageProps} />
          </div>
        </CookiesProvider>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
