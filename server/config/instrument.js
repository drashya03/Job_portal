// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration} from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://ccc8aa87f3aba37882bbfd56ef17ff3e@o4510202655604736.ingest.us.sentry.io/4510202659143680",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
//   tracesSampleRate: 1.0,
});



Sentry.profiler.startProfiler();