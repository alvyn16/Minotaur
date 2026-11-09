<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 148 36"
		fill="none"
		:class="{ animate }"
		class="minotaur-text-logo"
	>
		<!-- Minotaur Brand Icon -->
		<g fill="var(--color-brand, #1bd96a)">
			<!-- Outer horns / crest -->
			<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2L20.5 7H15.5L18 2ZM24.5 8.5L31 6C33 5 35 7 34.5 9.5C34 14 31 18.5 27 21.5L25 19.5C28 17 30.5 13 31 10L24.8 12.2L24.5 8.5ZM11.5 8.5L5 6C3 5 1 7 1.5 9.5C2 14 5 18.5 9 21.5L11 19.5C8 17 5.5 13 5 10L11.2 12.2L11.5 8.5Z" />
			<!-- Central shield / labyrinth -->
			<path fill-rule="evenodd" clip-rule="evenodd" d="M10 14.5H26L25 25.5L18 33L11 25.5L10 14.5ZM13 17L13.8 24.5L18 29L22.2 24.5L23 17H13ZM15.5 19.5H20.5V24.5L18 27L15.5 24.5V19.5Z" />
		</g>
		<!-- Wordmark: minotaur -->
		<text
			x="40"
			y="25"
			fill="currentColor"
			font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
			font-size="19"
			font-weight="700"
			letter-spacing="-0.5px"
		>minotaur</text>
	</svg>
</template>

<script setup>
defineProps({
	animate: {
		type: Boolean,
		default: false,
	},
})
</script>

<style scoped>
.minotaur-text-logo {
	display: inline-block;
	vertical-align: middle;
}
</style>
