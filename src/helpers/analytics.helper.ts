type AnalyticsEvent =
  | "Onboarding completed"
  | "Workout started"
  | "Freestanding workout started"
  | "Workout resumed"
  | "Workout completed";

type PlausibleFunction = ((event: AnalyticsEvent) => void) & {
  q?: AnalyticsEvent[][];
};

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

const PLAUSIBLE_SCRIPT_ID = "plausible-script";

const initializeAnalytics = () => {
  if (!import.meta.env.PROD || document.getElementById(PLAUSIBLE_SCRIPT_ID)) {
    return;
  }

  const queueEvent = ((event: AnalyticsEvent) => {
    queueEvent.q = [...(queueEvent.q ?? []), [event]];
  }) as PlausibleFunction;
  window.plausible ??= queueEvent;

  const script = document.createElement("script");
  script.id = PLAUSIBLE_SCRIPT_ID;
  script.defer = true;
  script.dataset.domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? window.location.hostname;
  script.src = "https://plausible.io/js/script.js";
  document.head.append(script);
};

const trackAnalyticsEvent = (event: AnalyticsEvent) => {
  if (import.meta.env.PROD) {
    window.plausible?.(event);
  }
};

export { type AnalyticsEvent, initializeAnalytics, trackAnalyticsEvent };
