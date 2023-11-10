<script>
    import "../app.css";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

    register('en', () => import('../locales/en.json'));
    register('sv', () => import('../locales/sv.json'));

    let initialLocale = 'en'; // default locale

    onMount(() => {
        if (browser) {
            const savedLanguage = localStorage.getItem('locale');
            initialLocale = savedLanguage || getLocaleFromNavigator();
        }

        const supportedLanguages = ['en', 'sv'];
        initialLocale = supportedLanguages.includes(initialLocale) ? initialLocale : 'en';

        init({
            fallbackLocale: 'en',
            initialLocale: initialLocale,
        });
    });
</script>

<div class="max-w-7xl mx-auto my-8">
    <slot />
</div>

<style>
    :global(body) {
        @apply bg-gray-900 text-white;
    }
</style>