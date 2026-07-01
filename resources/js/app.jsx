import "./bootstrap";
import "../css/app.css";

import { createInertiaApp, router } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

const appName = import.meta.env.VITE_APP_NAME;

function ProgressBar() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const start = () => setLoading(true);
        const finish = () => setLoading(false);

        router.on("start", start);
        router.on("finish", finish);

        return () => {
            if (typeof router.off === "function") {
                router.off("start", start);
                router.off("finish", finish);
            }
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ animation: "progress 2s ease-in-out infinite" }} />
        </div>
    );
}

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ProgressBar />
                <App {...props} />
            </ThemeProvider>
        );
    },
});
