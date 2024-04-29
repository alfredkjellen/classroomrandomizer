

<script>
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from '$app/navigation';
    import { user } from "$lib/firebase";
    import AuthCheck from "$lib/components/AuthCheck.svelte";

    
    

   async function handleSignOut() {
        await signOut(auth);
        goto('/login');
    }


</script>

<AuthCheck text="Log in to view account">



<button class="btn btn-warning" on:click={handleSignOut}>Sign out</button>





</AuthCheck>



