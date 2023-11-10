<script>
    import { t } from "svelte-i18n";
</script>

<p class="text-white text-[12px] my-4 text-center print:hidden max-w-lg mx-auto">{$t('disclaimer')}</p>
<p class="text-white text-[10px] mt-6 text-center print:hidden">{$t('copyright1')} <a href="https://github.com/OfficialAudite/" class=" text-blue-500 hover:text-blue-300 hover:underline">@officialaudite</a></p>
<p class="text-white text-[10px] text-center print:hidden">{$t('copyright2')} <a href="mailto:info@audite.dev" class=" text-blue-500 hover:text-blue-300 hover:underline">info@audite.dev</a></p>
