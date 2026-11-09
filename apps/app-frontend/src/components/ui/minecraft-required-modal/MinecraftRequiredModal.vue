<template>
	<NewModal ref="modal" header="Play Minecraft" max-width="500px" no-padding>
		<div class="flex flex-col gap-5 p-6">
			<div>
				<div class="font-semibold text-xl text-contrast">
					Choose Account
				</div>
				<div class="text-secondary text-sm mt-1">
					Enter an offline username to jump right into the game, or sign in to your Microsoft account.
				</div>
			</div>

			<!-- Offline Section -->
			<div class="flex flex-col gap-3 bg-surface-2 border border-surface-4 rounded-xl p-4">
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-semibold text-secondary uppercase tracking-wider">
						Offline Username
					</label>
					<input
						v-model="offlineUsername"
						type="text"
						placeholder="e.g. Steve"
						class="w-full bg-surface-3 text-primary border border-surface-5 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand"
						maxlength="16"
						:disabled="loadingOffline || loadingSignIn"
						@keydown.enter="playOffline"
					/>
					<span v-if="offlineError" class="text-xs text-red mt-0.5">
						{{ offlineError }}
					</span>
				</div>

				<Button
					type="colored"
					color="brand"
					class="w-full justify-center"
					:disabled="loadingOffline || loadingSignIn || !offlineUsername.trim()"
					@click="playOffline"
				>
					<SpinnerIcon v-if="loadingOffline" class="animate-spin mr-1" />
					<PlayIcon v-else class="mr-1" />
					Play Offline
				</Button>
			</div>

			<div class="flex items-center gap-3">
				<div class="h-px grow bg-surface-4"></div>
				<span class="text-xs uppercase text-secondary font-medium tracking-wider">Or</span>
				<div class="h-px grow bg-surface-4"></div>
			</div>

			<!-- Microsoft Section -->
			<Button
				class="w-full justify-center !bg-surface-2 hover:!bg-surface-3 !text-primary border border-surface-4"
				:disabled="loadingOffline || loadingSignIn"
				@click="signIn"
			>
				<SpinnerIcon v-if="loadingSignIn" class="animate-spin mr-1" />
				<svg
					v-else
					width="18"
					height="18"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2"
				>
					<rect width="9.25" height="9.25" fill="#f25022" />
					<rect x="10.75" width="9.25" height="9.25" fill="#7fba00" />
					<rect y="10.75" width="9.25" height="9.25" fill="#00a4ef" />
					<rect x="10.75" y="10.75" width="9.25" height="9.25" fill="#ffb900" />
				</svg>
				Sign in to Microsoft
			</Button>
		</div>
	</NewModal>
</template>

<script setup lang="ts">
import { PlayIcon, SpinnerIcon } from '@modrinth/assets'
import { Button, NewModal } from '@modrinth/ui'
import { ref } from 'vue'

import { handleSevereError } from '@/composables/use-error.js'
import { injectMinecraftAccounts } from '@/features/minecraft-accounts/context'
import { login as loginFlow, login_offline, set_default_user } from '@/helpers/auth.js'
import { run } from '@/helpers/instance.js'

const minecraftAccounts = injectMinecraftAccounts()

const modal = ref<InstanceType<typeof NewModal>>()
const offlineUsername = ref('Player')
const offlineError = ref('')
const loadingOffline = ref(false)
const loadingSignIn = ref(false)
const pendingInstanceId = ref<string | null>(null)

function show(instanceId?: string) {
	if (instanceId && typeof instanceId === 'string') {
		pendingInstanceId.value = instanceId
	}
	offlineError.value = ''
	modal.value?.show()
}

async function playOffline() {
	const name = offlineUsername.value.trim()
	if (!name) {
		offlineError.value = 'Username cannot be empty.'
		return
	}
	if (name.length > 16) {
		offlineError.value = 'Username must be at most 16 characters.'
		return
	}
	if (!/^[a-zA-Z0-9_]+$/.test(name)) {
		offlineError.value = 'Username may only contain letters, numbers, and underscores.'
		return
	}

	loadingOffline.value = true
	offlineError.value = ''

	try {
		const user = await login_offline(name)
		await set_default_user(user.profile.id)
		if (minecraftAccounts.value?.refreshValues) {
			await minecraftAccounts.value.refreshValues().catch(() => {})
		}
		modal.value?.hide()

		if (pendingInstanceId.value) {
			const idToRun = pendingInstanceId.value
			pendingInstanceId.value = null
			await run(idToRun).catch((err) => handleSevereError(err))
		}
	} catch (error) {
		handleSevereError(error)
	} finally {
		loadingOffline.value = false
	}
}

async function signIn() {
	loadingSignIn.value = true

	try {
		const loggedIn = await loginFlow()
		if (!loggedIn) return

		await set_default_user(loggedIn.profile.id)
		if (minecraftAccounts.value?.refreshValues) {
			await minecraftAccounts.value.refreshValues().catch(() => {})
		}
		modal.value?.hide()

		if (pendingInstanceId.value) {
			const idToRun = pendingInstanceId.value
			pendingInstanceId.value = null
			await run(idToRun).catch((err) => handleSevereError(err))
		}
	} catch (error) {
		handleSevereError(error)
	} finally {
		loadingSignIn.value = false
	}
}

defineExpose({
	show,
})
</script>
