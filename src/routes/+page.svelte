<script>
    import { nanoid } from 'nanoid'
    import { jsPDF } from 'jspdf';
    
    /*
    "id": nanoid(),
    "title": "New item...",
    "description": "New description...",
    "type": "New type...",
    "estimatedTime": 60,
    "marginPercentage": 0.5
    */
   
   let items = []
   let editing = {};

    function calculateEstimatedTimeRange(timeInSeconds, marginPercentage) {
        const hours = timeInSeconds / 60;
        const roundedHours = Math.ceil(hours);
        const adjustedHours = Math.ceil(hours * (1 + marginPercentage));
        return `${roundedHours}h - ${adjustedHours}h`;
    }

    function calculateTotalTimeRange(items) {
        let totalHours = 0;
        let totalAdjustedHours = 0;

        items.forEach(item => {
            const hours = item.estimatedTime / 60;
            totalHours += Math.ceil(hours);
            totalAdjustedHours += Math.ceil(hours * (1 + item.marginPercentage));
        });

        return `${totalHours}h - ${totalAdjustedHours}h`;
    }

    function handleFieldChange(event, itemId, field) {
        const newValue = event.target.textContent;
        items = items.map(item => {
            if (item.id === itemId) {
                return { ...item, [field]: field === 'estimatedTime' ? parseInt(newValue) : newValue };
            }
            return item;
        });
    }

    function handleFocus(event, item) {
        editing[item.id] = true;
        event.target.textContent = item.estimatedTime;
    }
    
    function handleBlur(event, item) {
        console.log(event);
        const minutes = parseFloat(event.target.textContent);
        if (!isNaN(minutes)) {
            item.estimatedTime = minutes / 60;
        }
        editing[item.id] = false;
        event.target.textContent = calculateEstimatedTimeRange(item.estimatedTime, item.marginPercentage);
    }

    $: displayedItems = items.map(item => ({
        ...item,
        displayTime: editing[item.id] ? (item.estimatedTime / 60).toString() : calculateEstimatedTimeRange(item.estimatedTime, item.marginPercentage)
    }));

    let showPopup = false;

    let title = '';
    let description = '';
    let type = '';
    let estimatedTime = 60;
    let marginPercentage = 0.5;

    function addNew() {
        showPopup = true;
    }

    function saveNewItem() {        
        const newItem = {
            id: nanoid(),
            title,
            description,
            type,
            estimatedTime,
            marginPercentage
        };

        items = [...items, newItem];

        showPopup = false;

        title = '';
        description = '';
        type = '';
        estimatedTime = 60;
        marginPercentage = 0.5;
        showPopup = false;
    }

    function exportToPDF() {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Time Estimation', 14, 22);

        // Table headers
        doc.setFontSize(11);
        doc.setTextColor(100);
        const headers = ["Title", "Description", "Type", "Estimated Time"];
        doc.table(14, 30, items.map(item => [
            item.title,
            item.description,
            item.type,
            calculateEstimatedTimeRange(item.estimatedTime, item.marginPercentage)
        ]), headers, { autoSize: true });

        // Save the PDF
        doc.save('time_estimation.pdf');
    }

</script>

{#if showPopup}
  <div class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-10">
    <div class="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Add New Item</h2>
      <form on:submit|preventDefault={saveNewItem}>
        <div class="mb-4">
          <label class="block mb-1" for="title">Title</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="title" bind:value={title} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="description">Description</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="description" bind:value={description} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="type">Type</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="text" id="type" bind:value={type} />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="estimatedTime">Estimated Time (minutes)</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="number" id="estimatedTime" bind:value={estimatedTime} />
        </div>
        <div class="mb-6">
          <label class="block mb-1" for="marginPercentage">Margin Percentage</label>
          <input class="w-full p-2 rounded bg-gray-800 border border-gray-700" type="number" id="marginPercentage" bind:value={marginPercentage} step="0.01" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:ring">Add</button>
          <button type="button" class="bg-red-600 hover:bg-red-700 py-2 px-4 rounded focus:outline-none focus:ring" on:click={() => showPopup = false}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<div class="table-container relative max-w-5xl mx-auto bg-gray-800 rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 bg-gray-800 flex justify-between items-center">
        <h1 class="text-xl font-bold text-white">Time Estimation</h1>
        <div>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => exportToPDF()}>
                Export
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => addNew()}>
                + Add Item
            </button>
        </div>
    </div>
    
    <div class="overflow-x-auto">
        <table class="min-w-full">
            <thead class="bg-gray-700">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-2/4 break-words">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estimated Time</th>
                </tr>
            </thead>
            <tbody class="bg-gray-800 divide-y divide-gray-700">
                {#if displayedItems.length === 0}
                    <tr>
                        <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center">No items to display</td>
                    </tr>
                {/if}
                {#each displayedItems as item}
                    <tr id={item.id}>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400" contenteditable="true" 
                            on:blur="{(event) => handleFieldChange(event, item.id, 'title')}">
                            {item.title}
                        </td>
                        <td class="px-6 py-4 whitespace-normal text-sm text-gray-400 break-words max-w-s" contenteditable="true"
                            on:blur="{(event) => handleFieldChange(event, item.id, 'description')}">
                            {item.description}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400" contenteditable="true"
                            on:blur="{(event) => handleFieldChange(event, item.id, 'type')}">
                            {item.type}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400" contenteditable="true"
                            on:focus={(event) => handleFocus(event, item)}
                            on:blur={(event) => handleBlur(event, item)}>
                            {item.displayTime}
                        </td>
                    </tr>
                {/each}
                {#if displayedItems.length !== 0}
                    <tr class="bg-gray-700">
                        <td colspan="3" class="px-6 py-2 whitespace-nowrap text-sm text-gray-400 text-right font-bold">Summarized</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-bold">
                            {calculateTotalTimeRange(items)}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>