<script>
  export let item;
  export let handleFieldChange;
  export let handleFocus;
  export let handleBlur;
</script>

<tr id={item.id}>
    <td class="relative px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        <div
            contenteditable="true"
            class="py-1"
            on:blur={(event) => handleFieldChange(event, item.id, "title")}
        >
            {item.title}
        </div>
        <object
            data="/edit.svg"
            type="image/svg+xml"
            class="print:hidden absolute top-1 right-1 w-4 h-4 cursor-pointer fill-current text-gray-500 hover:text-gray-300"
            aria-label="Edit Icon"
        />
    </td>
    <td
        class="relative px-6 py-4 whitespace-normal text-sm text-gray-400 break-words max-w-s"
    >
        <div
            contenteditable="true"
            class="py-1"
            on:blur={(event) =>
                handleFieldChange(event, item.id, "description")}
        >
            {item.description}
        </div>
        <object
            data="/edit.svg"
            type="image/svg+xml"
            class="print:hidden absolute top-1 right-1 w-4 h-4 cursor-pointer fill-current text-gray-500 hover:text-gray-300"
            aria-label="Edit Icon"
        />
    </td>
    <td class="relative px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        <div
            contenteditable="true"
            class="py-1"
            on:blur={(event) => handleFieldChange(event, item.id, "type")}
        >
            {item.type}
        </div>
        <object
            data="/edit.svg"
            type="image/svg+xml"
            class="print:hidden absolute top-1 right-1 w-4 h-4 cursor-pointer fill-current text-gray-500 hover:text-gray-300"
            aria-label="Edit Icon"
        />
    </td>
    <td class="relative px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        <div
            contenteditable="true"
            class="py-1"
            on:focus={(event) => handleFocus(event, item)}
            on:blur={(event) => handleBlur(event, item)}
        >
            {item.displayTime}
        </div>
        <object
            data="/edit.svg"
            type="image/svg+xml"
            class="print:hidden absolute top-1 right-1 w-4 h-4 cursor-pointer fill-current text-gray-500 hover:text-gray-300"
            aria-label="Edit Icon"
        />
    </td>
</tr>

<style>
  @media print {
    :global(body) {
      color: black;
      background: white;
    }
    .text-gray-400, .text-gray-500 {
      color: black !important;
    }
    [contenteditable="true"] {
      border: none !important;
      outline: none !important;
    }
    td {
      border: 1px solid black;
      padding: 0.5rem;
      color: black;
    }
    .absolute, .relative {
      position: static !important;
    }
  }
</style>