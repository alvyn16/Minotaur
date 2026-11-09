<template>
	<Transition name="splash-fade" @after-leave="onAfterLeave">
		<div v-if="!doneLoading" class="splash-screen" :class="`${theme.active}-mode`">
			<div class="app-logo-wrapper" data-tauri-drag-region>
				<svg
					class="app-logo"
					viewBox="0 0 270 36"
					xml:space="preserve"
					style="
						fill-rule: evenodd;
						clip-rule: evenodd;
						stroke-linejoin: round;
						stroke-miterlimit: 2;
					"
					color="var(--color-contrast)"
				>
					<g transform="matrix(0.0703125, 0, 0, 0.0703125, 2, 0)" fill="var(--color-brand, #1bd96a)">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M256 32L292 96H220L256 32ZM344 116L432 80C462 68 492 94 488 126C480 188 440 252 384 296L352 268C396 230 430 178 436 132L348 168L344 116ZM168 116L80 80C50 68 20 94 24 126C32 188 72 252 128 296L160 268C116 230 82 178 76 132L164 168L168 116Z"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M144 200H368L352 360L256 464L160 360L144 200ZM186 236L196 344L256 412L316 344L326 236H186ZM224 272H288V344L256 376L224 344V272Z"
						/>
					</g>
					<text
						x="46"
						y="26"
						font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
						font-size="22"
						font-weight="700"
						letter-spacing="-0.5px"
					>
						<tspan fill="currentColor">minotaur</tspan>
						<tspan dx="8" fill="var(--color-brand, #1bd96a)">launcher</tspan>
					</text>
				</svg>
				<ProgressBar class="loading-bar" :progress="Math.min(loadingProgress, 100)" />
				<span v-if="message">{{ message }}</span>
			</div>
			<div class="gradient-bg" data-tauri-drag-region></div>
			<div class="cube-bg"></div>
			<div class="base-bg"></div>
		</div>
	</Transition>
</template>

<script setup>
import { injectLoadingState } from '@modrinth/ui'
import { onMounted, ref, watch } from 'vue'

import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useAppEvent } from '@/composables/use-app-event'
import { useTheme } from '@/composables/use-theme.ts'
import { debugStartup } from '@/helpers/startup-debug'

const theme = useTheme()

const doneLoading = ref(false)
const loadingProgress = ref(0)
const message = ref()

const MIN_DISPLAY_MS = 500
const mountedAt = Date.now()

const loading = injectLoadingState()
onMounted(() => debugStartup('Splash mounted'))

function onAfterLeave() {
	debugStartup('Splash fade completed', { displayedMs: Date.now() - mountedAt })
	loading.setEnabled(true)
}

watch(
	[loading.barEnabled, loading.pending],
	([barEnabled, pending]) => {
		debugStartup('Splash loading state changed', { barEnabled, pending })
		if (barEnabled) {
			return
		}

		if (pending) {
			loadingProgress.value = 0
			fakeLoadingIncrease()
			return
		}

		const elapsed = Date.now() - mountedAt
		const delay = Math.max(0, MIN_DISPLAY_MS - elapsed)
		debugStartup('Splash dismissal scheduled', { delayMs: delay, displayedMs: elapsed })

		setTimeout(() => {
			if (loading.pending.value) {
				debugStartup('Splash dismissal deferred: new loading work')
				return
			}
			doneLoading.value = true
			debugStartup('Splash fade started', { displayedMs: Date.now() - mountedAt })
		}, delay)
	},
	{ immediate: true },
)

function fakeLoadingIncrease() {
	if (loadingProgress.value < 95) {
		setTimeout(() => {
			loadingProgress.value += 2
			fakeLoadingIncrease()
		}, 5)
	}
}

useAppEvent('loading', (e) => {
	if (e.event.type === 'directory_move') {
		loadingProgress.value = 100 * (e.fraction ?? 1)
		message.value = 'Updating app directory...'
	}
})
</script>

<style scoped lang="scss">
.splash-screen {
	position: fixed;
	inset: 0;
	z-index: 10000;

	--splash-cube-image: url('@/assets/loading/cube.png');

	&.light-mode {
		--splash-cube-image: url('@/assets/loading/cube-light.webp');
	}
}

.splash-fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.splash-fade-leave-to {
	opacity: 0;
}

.app-logo-wrapper {
	position: absolute;
	height: 100vh;
	width: 100%;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	gap: 1rem;
	color: var(--color-contrast);

	z-index: 9998;
}

.app-logo {
	height: 2.5rem;
	width: auto;
	max-width: 90vw;
}

.loading-bar {
	max-width: 20rem;
}

.gradient-bg {
	position: absolute;
	height: 100vh;
	width: 100vw;
	background:
		linear-gradient(180deg, var(--splash-tint-top) 0%, var(--splash-tint-bottom) 97.29%),
		linear-gradient(0deg, var(--splash-overlay), var(--splash-overlay));
	z-index: 9997;
}

.cube-bg {
	position: absolute;

	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	width: 180vw;
	height: 180vh;
	background-color: var(--color-bg);

	z-index: 9996;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--splash-cube-image) center no-repeat;
		background-size: contain;
		opacity: var(--splash-cube-opacity);
		mix-blend-mode: var(--splash-cube-blend);
	}
}

.base-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: var(--color-bg);
	z-index: 9995;
}
</style>
