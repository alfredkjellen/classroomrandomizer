<script lang="ts">
    import { user } from "$lib/firebase";
    export let text = "You must be signed in to view this page.";

</script>



    {#if $user}
    <slot/>
    {:else}
    <p class="text-warning my-10">
        {text}
        <a class = "btn btn-primary" href="/login"> Log in </a>
    </p>

    {/if}



