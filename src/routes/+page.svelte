<script>
    import { browser } from '$app/environment';
    import { nanoid } from 'nanoid'
    import { onMount } from 'svelte';
    import { t, locale } from 'svelte-i18n';
    
    import Popup from '$lib/components/Popup.svelte';
    import ItemsTable from '$lib/components/ItemsTable.svelte';
    import Copyright from '$lib/components/Copyright.svelte';
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
   
    let items = [];
    let editing = {};
    
    function calculateEstimatedTimeRange(timeInSeconds, marginPercentage) {
        const hours = timeInSeconds / 3600;
        const roundedHours = Math.ceil(hours);
        const adjustedHours = Math.ceil(hours * (1 + (marginPercentage/100)));
        return `${roundedHours}${$t('hours_short')} - ${adjustedHours}${$t('hours_short')}`;
    }

    function calculateTotalTimeRange(items) {
        let totalHours = 0;
        let totalAdjustedHours = 0;

        items.forEach(item => {
            const hours = item.estimatedTime / 3600;
            totalHours += Math.ceil(hours);
            totalAdjustedHours += Math.ceil(hours * (1 + (item.marginPercentage/100)));
        });

        return `${totalHours}${$t('hours_short')} - ${totalAdjustedHours}${$t('hours_short')}`;
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

    function removeLogo() {
        if (browser)
            localStorage.removeItem("image");

        image = "";
    }

    function resetPopupData(){
        showPopup = false;
        title = '';
        description = '';
        type = '';
        estimatedTime = 60;
        marginPercentage = 50;
    }


    let image = getImage();

    $: image;
    
    function getImage() {
        if (browser)
            return localStorage.getItem("image");
        else
            return "";
    }
    
    let files = {
        accepted: [],
        rejected: []
    };

    function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];

        // get the uploaded image, convert it to base64 and save it to the localStorage under image key
        const reader = new FileReader();
        reader.readAsDataURL(files.accepted[0]);
        reader.onload = () => {
            const base64Image = reader.result;
            if (browser)
                localStorage.setItem("image", base64Image);
            image = base64Image;
        };
    }

    let initlocale;

    if (browser)
        initlocale = localStorage.getItem("locale");

    let currentDate = new Date().toJSON().slice(0, 10);

    $: if ($locale){
        if (browser){
            if($locale !== initlocale){
                localStorage.setItem("locale", $locale);
            }
        }
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

<Dropzone on:drop={handleFilesSelect} accept="image/png" containerClasses="max-w-sm mx-auto my-4 print:!hidden !bg-transparent !border-white/[.05]">
    {#if image !== null && image !== ""}
        <img src={image} alt="Logo" class="w-32 mx-auto">
    {:else}
        <p class="text-center">{$t('logo_upload')}</p>
    {/if}
</Dropzone>

{#if image !== null && image !== ""}
    <img src={image} alt="Logo" class="w-64 mx-auto my-4 hidden print:block">
{/if}

<div id="main" class="relative max-w-5xl mx-auto bg-gray-800 print:bg-white print:rounded-none rounded-lg shadow print:shadow-transparent overflow-hidden">
    <div class="px-6 py-4 bg-gray-800 flex justify-between items-center">
        <h1 class="text-xl font-bold text-white">{$t('title')}</h1>
        <div>
            <select bind:value={$locale} class="bg-gray-800 print:hidden text-white border border-gray-600 rounded-md px-4 py-2 mr-2 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="en">English</option>
                <option value="sv">Swedish</option>
                <option value="lt">Lithuanian</option>
            </select>
            {#if items.length > 0}
                <button class="print:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => resetLocalStorage()}>
                    {$t('reset_items')}
                </button>
            {/if}
            {#if image !== null && image !== ""}
                <button class="print:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => removeLogo()}>
                    {$t('reset_logo')}
                </button>
            {/if}
            <button class="print:hidden bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded" on:click={() => printPage()}>
                {$t('export')}
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

<p class="hidden print:block fixed print:bottom-0 print:right-0 text-black">{currentDate}</p>

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