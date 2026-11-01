import { AskAiButton } from "@/components/ai/ask-ai-button";
import { CookieBanner } from "@/components/cookie-banner";
import { Footer } from "@/components/footer";
import { Band } from "@/components/grid";
import { Header } from "@/components/header";
import { RevealRoot } from "@/components/reveal-root";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

/**
 * The frame every marketing page lives in: the grid header, the page's bands,
 * the footer inside the frame, and the Ask AI button bounded to the frame
 * width. Pages only supply their bands.
 */
export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
});

function LandingLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <div className="landing min-h-screen overflow-x-clip bg-background">
      <Header />
      <Outlet />
      {/* Muted ground outside the rails; the footer draws its own white
          panel and muted copyright row inside them. */}
      <Band tone="muted" className="border-b-0">
        <Footer />
      </Band>
      <AskAiButton bound="1320px" variant="overlay" />
      {/* Each page brings its own elements to reveal. */}
      <RevealRoot key={pathname} />
      <CookieBanner />
    </div>
  );
}
