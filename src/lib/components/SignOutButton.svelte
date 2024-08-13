<script lang="ts">
  import { auth } from "$lib/firebase";
  import { signOut } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";


  let modalElement: HTMLDialogElement;

  function openModal() {
    if (modalElement) {
      modalElement.showModal();
    }
  }
  
  async function handleSignOut() {
    await signOut(auth);
    goto("/");
  }


  function closeModal() {
    if (modalElement) {
      modalElement.close();
    }
  }

  onMount(() => {
    // Ensure the modal is properly initialized
    if (modalElement && !modalElement.open) {
      modalElement.close(); // Ensure it's closed initially
    }
  });

</script>
<button class="btn btn-secondary btn-sm" on:click={openModal}>
  Sign out
</button>

<dialog bind:this={modalElement} class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Confirm Sign Out</h3>
    <p class="py-4">Are you sure you want to sign out?</p>
    <div class="modal-action">
      <button class="btn" on:click={handleSignOut}>Yes, Sign Out</button>
      <button class="btn" on:click={closeModal}>Cancel</button>
    </div>
  </div>
</dialog>