<script>
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from '$app/navigation';

    
    
   async function handleSignOut() {
        await signOut(auth);
        goto('/');
    }


</script>



<button class="btn btn-secondary btn-sm" onclick="my_modal_3.showModal()">Sign out</button>
<dialog id="my_modal_3" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="font-bold text-lg">Do you want to sign out?</h3>
    <button class="btn btn-secondary btn-sm mt-5" on:click={handleSignOut}>Sign out</button>
  </div>
</dialog>

