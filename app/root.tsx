import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useNavigate,
  useLoaderData
} from "react-router";
import "@navikt/ds-css/dist/index.css";
import "app/novari-theme.css";

import type { Route } from "./+types/root";
import "./app.css";
import {Box, Page} from "@navikt/ds-react";
import {NovariFooter, NovariHeader} from "novari-frontend-components";

export const loader: LoaderFunction = async ({request}) => {
  const username = request.headers.get("x-fullname") || "brukernavn";
  return {username};
};

export function Layout({ children }: { children: React.ReactNode }) {
  const {username} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body data-theme="novari">
    <Page
      footer={
        <Box as="footer" background={"surface-alt-3-moderate"}>
          <Page.Block gutters width="lg">
            <NovariFooter links={[]} />
          </Page.Block>
        </Box>
      }
    >
      <Box
        as="header"
        className={"pt-2 pb-2 pl-2 pr-2"}
        background={"bg-default"}
      >
        <NovariHeader
          appName={"FINT Adapter Kontrakter"}
          menu={[["Home", "/"], ["Kontrakter", "/kontrakter"]]}
          isLoggedIn={true}
          displayName={username}
          onMenuClick={ (action )=> navigate(action)}
        />
      </Box>
      <Page.Block as="main" gutters width="lg">
        {children}
      </Page.Block>
    </Page>
    <ScrollRestoration />
    <Scripts />
    </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
