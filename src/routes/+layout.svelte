<script>
  import "../app.css";
</script>

<div class="max-w-7xl mx-auto my-8">
    <slot />
</div>

<style>
    :global(body) {
        @apply bg-gray-900 text-white h-screen;
    }
</style>