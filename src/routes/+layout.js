import { browser } from '$app/environment';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
    const { pathname } = url;

    let savedLanguage;

    if (browser)
        savedLanguage = localStorage.getItem('locale');

    if (!savedLanguage){
        savedLanguage = "en";
    }
    
    let initialLocale = savedLanguage || url.searchParams.get('lang') || getLocaleFromNavigator();

    const supportedLanguages = ['en', 'sv'];
    initialLocale = supportedLanguages.includes(initialLocale) ? initialLocale : 'en';

    register('en', () => import('../locales/en.json'));
    register('sv', () => import('../locales/sv.json'));

    init({
        fallbackLocale: 'en',
        initialLocale: initialLocale,
    });

    return {};
}