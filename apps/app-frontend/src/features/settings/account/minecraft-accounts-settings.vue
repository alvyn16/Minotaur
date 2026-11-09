<template>
	<div class="flex flex-col gap-4">
		<div>
			<h2 class="text-xl font-bold text-contrast m-0">Minecraft Accounts</h2>
			<p class="text-sm text-secondary m-0 mt-1">
				Manage your offline and Microsoft accounts. You can add offline usernames or sign in with Microsoft.
			</p>
		</div>
		<Suspense>
			<AccountsCard />
		</Suspense>
	</div>
</template>

<script setup lang="ts">
import AccountsCard from '@/features/minecraft-accounts/accounts-card.vue'
</script>
