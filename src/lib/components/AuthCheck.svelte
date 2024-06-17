<script lang="ts">
    import { user } from "$lib/firebase";
    import SignupButton from "./SignupButton.svelte";

    export let userIsDeleted:boolean = false;

</script>
    {#if $user}
    <slot/>

    {:else if userIsDeleted}
    <div class="flex justify-center mt-5">
        <div class="card bg-base-200 p-5 flex items-center">
          <div class="card-title">Your account has been deleted</div>
          <div class="card-actions flex items-center gap-5 mt-20">
            <SignupButton size="md"></SignupButton>
          </div>
        </div>
      </div>


    {:else}


    <div class="flex justify-center mt-5">
        <div class="card bg-base-200 p-5 flex items-center">
          <div class="card-title">You must be signed in to view this page</div>
          <div class="card-actions flex items-center gap-5 mt-5">
            <a href="/login" class="btn btn-primary">Log in</a>
            <SignupButton size="md"></SignupButton>
          </div>
        </div>
      </div>
    {/if}



