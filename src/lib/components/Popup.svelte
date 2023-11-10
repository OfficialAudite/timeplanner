<script>
    import { t } from "svelte-i18n";
    export let showPopup;
    export let saveNewItem;
    export let title;
    export let description;
    export let type;
    export let estimatedTime;
    export let marginPercentage;
    export let resetPopupData;
</script>

{#if showPopup}
  <div class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-10">
    <div class="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">{$t('add_new_item')}</h2>
      <form on:submit|preventDefault={saveNewItem}>
        <div class="mb-4">
          <label class="block mb-1" for="title">{$t('popup_title')}</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="title" bind:value={title} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="description">{$t('popup_description')}</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="description" bind:value={description} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="type">{$t('popup_type')}</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="type" bind:value={type} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="estimatedTime">{$t('popup_estimated_time')}</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="number" id="estimatedTime" bind:value={estimatedTime} />
        </div>
        <div class="mb-6">
          <label class="block mb-1" for="marginPercentage">{$t('margin_percentage')}</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="number" id="marginPercentage" bind:value={marginPercentage} step="1" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:ring">{$t('add_button')}</button>
          <button type="button" class="bg-red-600 hover:bg-red-700 py-2 px-4 rounded focus:outline-none focus:ring" on:click={() => resetPopupData()}>{$t('cancel_button')}</button>
        </div>
      </form>
    </div>
  </div>
{/if}