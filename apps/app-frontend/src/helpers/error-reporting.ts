import type { App } from 'vue'
import type { Router } from 'vue-router'

/**
 * Local-only error logger. Remote Sentry telemetry is completely disabled
 * to preserve user privacy.
 */
export function setupErrorReporting(app: App, _router: Router): void {
	const previousHandler = app.config.errorHandler

	app.config.errorHandler = (error, instance, info) => {
		if (previousHandler) {
			previousHandler(error, instance, info)
		} else {
			console.error('[Minotaur Error]', error, info)
		}
	}
}
