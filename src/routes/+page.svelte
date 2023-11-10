<script>
    import { browser } from '$app/environment';
    import { nanoid } from 'nanoid'
    import { onMount } from 'svelte';

    import Popup from '$lib/components/Popup.svelte';
    import ItemsTable from '$lib/components/ItemsTable.svelte';
    import Copyright from '$lib/components/Copyright.svelte';
   
    let items = [];
    let editing = {};
    
    function calculateEstimatedTimeRange(timeInSeconds, marginPercentage) {
        const hours = timeInSeconds / 3600;
        const roundedHours = Math.ceil(hours);
        const adjustedHours = Math.ceil(hours * (1 + (marginPercentage/100)));
        return `${roundedHours}h - ${adjustedHours}h`;
    }

    function calculateTotalTimeRange(items) {
        let totalHours = 0;
        let totalAdjustedHours = 0;

        items.forEach(item => {
            const hours = item.estimatedTime / 3600;
            totalHours += Math.ceil(hours);
            totalAdjustedHours += Math.ceil(hours * (1 + (item.marginPercentage/100)));
        });

        return `${totalHours}h - ${totalAdjustedHours}h`;
    }

    function handleFieldChange(event, itemId, field) {
        const textContent = event.target.textContent;
        const newValue = field === 'estimatedTime' ? parseFloat(textContent) * 60 : textContent;
        items = items.map(item => {
            if (item.id === itemId) {
                return { ...item, [field]: newValue };
            }
            return item;
        });
        if (browser)
            localStorage.setItem("data", JSON.stringify(items));
    }

    function handleFocus(event, item) {
        editing[item.id] = true;
        event.target.textContent = item.estimatedTime / 60;
    }

    function handleBlur(event, item) {
        const minutes = parseFloat(event.target.textContent);
        if (!isNaN(minutes)) {
            item.estimatedTime = minutes * 60;
        }
        event.target.textContent = calculateEstimatedTimeRange(item.estimatedTime, item.marginPercentage);
        editing[item.id] = false;
        items = items.map(i => i.id === item.id ? {...i} : i);
    }

    $: if (items) {
        items = items.map(item => ({
            ...item,
            displayTime: editing[item.id] ? (item.estimatedTime / 60).toString() + 'm' :
                calculateEstimatedTimeRange(item.estimatedTime, item.marginPercentage)
        }));
    }

    onMount(() => {
        if(JSON.parse(localStorage.getItem("data"))) {
            items = JSON.parse(localStorage.getItem("data"));
        }
    });

    let showPopup = false;
    let title = '';
    let description = '';
    let type = '';
    let estimatedTime = 60;
    let marginPercentage = 50;

    function addNew() {
        showPopup = true;
    }

    function saveNewItem() {
        items = [...items, {
            id: nanoid(),
            title,
            description,
            type,
            estimatedTime: estimatedTime * 60,
            marginPercentage
        }];

        title = '';
        description = '';
        type = '';
        estimatedTime = 60;
        marginPercentage = 50;
        showPopup = false;
        if (browser)
            localStorage.setItem("data", JSON.stringify(items));
    }

    function printPage() {
        window.print();
    }

    function resetLocalStorage() {
        if (browser)
            localStorage.removeItem("data");
        items = [];
    }

    function resetPopupData(){
        showPopup = false;
        title = '';
        description = '';
        type = '';
        estimatedTime = 60;
        marginPercentage = 50;
    }

</script>

<Popup 
    bind:showPopup={showPopup} 
    saveNewItem={saveNewItem} 
    bind:title={title} 
    bind:description={description} 
    bind:type={type} 
    bind:estimatedTime={estimatedTime} 
    bind:marginPercentage={marginPercentage}
    resetPopupData={resetPopupData}
/>

<div id="main" class="relative max-w-5xl mx-auto bg-gray-800 print:bg-white print:rounded-none rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 bg-gray-800 flex justify-between items-center">
        <h1 class="text-xl font-bold text-white">Time Estimation</h1>
        <div>
            <button class="print:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => printPage()}>
                Export
            </button>
            <button class="print:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => resetLocalStorage()}>
                Reset
            </button>
        </div>
    </div>
    
    <ItemsTable 
        items={items}
        handleFieldChange={handleFieldChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        addNew={addNew}
        calculateTotalTimeRange={calculateTotalTimeRange}
    />

</div>

<Copyright />

<style>
  @media print {
    :global(body) {
      color: black;
      background: white;
    }
    h1{
        color: #000;
    }
  }
</style>