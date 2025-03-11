import * as Sentry from '@sentry/vue'

export default function ({ app, dsn, url }) {
  Sentry.init({
    app,
    dsn,

    replaysSessionSampleRate: 0.1,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration({
        tracingOrigins: [
          'localhost',
          url,
          /^\//,
        ],
      }),

      new Sentry.Replay({
        // Additional SDK configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })

  app.mixin(Sentry.createTracingMixins({ trackComponents: true }))

  Sentry.attachErrorHandler(app, { logErrors: true })
}
