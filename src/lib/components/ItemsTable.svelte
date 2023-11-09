<script>
    import ItemRow from "./ItemRow.svelte";
    export let items;
    export let handleFieldChange;
    export let handleFocus;
    export let handleBlur;
    export let addNew;
    export let calculateTotalTimeRange;
</script>

<div class="overflow-x-auto">
    <table class="min-w-full">
        <thead class="bg-gray-700">
            <tr>
                <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >Title</th
                >
                <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-2/4 break-words"
                    >Description</th
                >
                <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >Type</th
                >
                <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >Estimated Time</th
                >
            </tr>
        </thead>
        <tbody class="bg-gray-800 divide-y divide-gray-700">
            {#if items.length === 0}
                <tr>
                    <td
                        colspan="4"
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center"
                        >No items to display</td
                    >
                </tr>
            {/if}
            {#each items as item}
                <ItemRow
                    {item}
                    {handleFieldChange}
                    {handleFocus}
                    {handleBlur}
                />
            {/each}
            <tr>
                <td
                    colspan="4"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center print:hidden"
                >
                    <button
                        class="w-6 h-6 rounded-full bg-gray-400/50 hover:bg-gray-400"
                        on:click={() => addNew()}>+</button
                    >
                </td>
            </tr>
            {#if items.length !== 0}
                <tr class="bg-gray-700">
                    <td
                        colspan="3"
                        class="px-6 py-2 whitespace-nowrap text-sm text-gray-400 text-right font-bold"
                        >Summarized</td
                    >
                    <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-bold"
                    >
                        {calculateTotalTimeRange(items)}
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<style>
  @media print {
    :global(body) {
      color: black;
      background: white;
    }
    .bg-gray-700, .bg-gray-800 {
      background-color: white !important;
    }
    .text-gray-400, .text-gray-500 {
      color: black !important;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid black;
      padding: 0.5rem;
      color: black;
    }
  }
</style>