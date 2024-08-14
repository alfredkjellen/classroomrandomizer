<script lang="ts">
import { user } from "$lib/firebase";

export let size = "xs";

</script>

{#if !$user}
    <a class={`btn btn-primary btn-${size}`} href="/signup">New school</a>
{/if}

    

