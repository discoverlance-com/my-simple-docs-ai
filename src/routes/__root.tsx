import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
       { charSet: "utf-8" },
       { name: "viewport", content: "width=device-width, initial-scale=1.0" },
       { property: "og:title", content: "My Simple AI Docs" },
       { property: "og:description", content: "Query your documents with AI" },
       { property: "og:site_name", content: "My Simple AI Docs" },
       { property: "og:type", content: "website" },
       { name: "twitter:card", content: "summary_card" },
       { name: "twitter:title", content: "My Simple AI Docs" },
       { name: "twitter:description", content: "Query your documents with AI" },
       { name: "twitter:site", content: "@Discoverlance" },
       { name: "twitter:creator", content: "@Discoverlance" },
       { name: "theme-color", content: "#1856c5" },
       { name: "application-name", content: "My Simple AI Docs" },
       { name: "publisher", content: "Discoverlance" },
       { name: "mobile-web-app-capable", content: "yes" },
       { name: "apple-mobile-web-app-title", content: "My Simple Notes" },
       { name: "apple-mobile-web-app-status-bar-style", content: "default" },
       { title: "My Simple AI Docs" },
     ],
     links: [
       { rel: "stylesheet", href: appCss },
       { rel: "icon", type: "image/svg+xml", href: "/file.svg" },
       { rel: "manifest", href: "/manifest.json" },
     ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />}
        <Toaster duration={3500} position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}
