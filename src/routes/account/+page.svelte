<script>
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    
</script>

<button class="btn btn-warning" on:click={() => signOut(auth)}>Sign out</button>
