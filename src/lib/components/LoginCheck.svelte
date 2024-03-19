<script lang="ts">
    import { user } from "$lib/firebase";
    let text = ""

</script>


    {#if !$user}
    <a class="btn btn-sm btn-primary" href="/login">Log in</a>
    {:else}
    <a class="btn btn-sm btn-primary" href="/account">Account</a>
    {/if}





