<script lang="ts">
import { user } from "$lib/firebase";

</script>

{#if !$user}
    <a class="btn btn-accent btn-xs" href="/signup">Sign up</a>
{/if}

    

