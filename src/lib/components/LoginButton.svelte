<script lang="ts">
    import { user } from "$lib/firebase";
    export let text1 = "Log in";
    export let text2 = "Account";

</script>


    {#if !$user}
    <a class="btn btn-primary" href="/login">{text1}</a>
    {:else}
    <a class="btn btn-outline btn-primary" href="/account">{text2}</a>
    {/if}

    


