import posthog from "posthog-js";

/**
 * PostHog on the marketing site: session replay, pageviews, autocapture and
 * exception capture. Next runs this file once in the browser before
 * hydration (`instrumentation-client`), so `posthog` can be imported from
 * `posthog-js` anywhere on the client afterwards.
 *
 * Same PostHog project as the dash (`apps/dash/src/lib/posthog.ts` in the
 * closed repo) so a visitor's anonymous session here merges into their
 * Person once they sign in there: `cross_subdomain_cookie` (default) stores
 * the distinct id on `.pipe0.com`, which app.pipe0.com reads. Project tokens
 * are public by design; the same one already ships in the dash bundle.
 *
 * Init is gated on the production hostname rather than NODE_ENV so preview
 * deployments and local builds send nothing. The project's internal-user
 * filter (`email contains @pipe0.com`) still applies to identified staff.
 */
const PROJECT_TOKEN = "phc_Y2MADEi9jluf7ola0ENBfTccMRV5EEqLddvJ5bxZ9um";

// Managed reverse proxy (ad blockers target PostHog's own domains). Serves
// ingestion and the lazily loaded recorder bundle under `/static/`. The UI
// host must stay PostHog's so links to the app resolve.
const API_HOST = "https://n.pipe0.com";
const UI_HOST = "https://eu.posthog.com";

const PRODUCTION_HOSTS = new Set(["pipe0.com", "www.pipe0.com"]);

if (PRODUCTION_HOSTS.has(window.location.hostname)) {
  posthog.init(PROJECT_TOKEN, {
    api_host: API_HOST,
    ui_host: UI_HOST,
    // 2025-05-24+: pageviews on History API navigation (App Router links).
    // 2025-11-30+: strictMinimumDuration for replay, so a bounce that
    // refreshes the page is judged on buffered data, not session age.
    defaults: "2026-05-30",
    // Anonymous visitors get no person profile (cheaper); the dash's
    // identify() upgrades them and back-links these events.
    person_profiles: "identified_only",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    // Replay itself is switched on by the project's remote config (Settings →
    // Session replay); sampling and minimum duration live there too.
    session_recording: {
      // Project setting says the same; stated here so a project-level change
      // can't silently unmask the email and Ask AI inputs.
      maskAllInputs: true,
    },
  });
}
