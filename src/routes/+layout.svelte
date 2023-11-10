<script>
  import "../app.css";
  import { isLoading } from "svelte-i18n";
</script>

<div class="max-w-7xl mx-auto my-8">
    {#if $isLoading}
    <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
    {:else}
        <slot />
    {/if}
</div>

<style>
    :global(body) {
        @apply bg-gray-900 text-white;
    }
</style>