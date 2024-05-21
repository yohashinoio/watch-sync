import "./bootstrap";
import "../css/app.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { RecoilRoot } from "recoil";
import { Notifications } from "@mantine/notifications";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <head>
                    <ColorSchemeScript />
                </head>
                <MantineProvider>
                    <Notifications />
                    <RecoilRoot>
                        <App {...props} />
                    </RecoilRoot>
                </MantineProvider>
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
