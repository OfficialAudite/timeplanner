import { browser } from '$app/environment';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
    const { pathname } = url;

    let savedLanguage = "en";

    if (browser)
        savedLanguage = localStorage.getItem('locale');
    
    let initialLocale = savedLanguage || url.searchParams.get('lang') || getLocaleFromNavigator();

    const supportedLanguages = ['en', 'sv', 'lt'];
    initialLocale = supportedLanguages.includes(initialLocale) ? initialLocale : 'en';

    register('en', () => import('../locales/en.json'));
    register('sv', () => import('../locales/sv.json'));
    register('lt', () => import('../locales/lt.json'));

    init({
        fallbackLocale: 'en',
        initialLocale: initialLocale ?? 'en',
    });

    return {};
}