/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				minotaur: {
					DEFAULT: '#1bd96a',
					dark: '#15b356',
					light: '#42e283',
					glow: 'rgba(27, 217, 106, 0.25)',
				},
				dark: {
					bg: '#0a0d10',
					card: '#12171d',
					cardHover: '#181f27',
					border: '#1f2730',
					muted: '#8b949e',
				},
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'sans-serif',
				],
			},
		},
	},
	plugins: [],
};
