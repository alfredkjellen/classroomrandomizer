<script lang="ts">

    import { auth } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import { user } from "$lib/firebase";

    import {
        GoogleAuthProvider,
        signInWithPopup,
    } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
        
    }


    console.log(user);



</script>

{#if !$user}

<h1 class=" text-4xl text-center p-5 "> Welcome to the Classroom Randomizer app</h1>


<div class="flex justify-center items-center max- gap-10">
    <div class=" rounded-box bg-base-300 p-6 w-auto">

       <div class="text-lg self-center">For schools already using it:</div>
      
        <a href="/login" class="btn btn-primary btn-wide">Log in</a>

    </div>
    <div class="rounded-box bg-base-300 p-6 w-auto">

        <div class="text-lg self-center">For new schools:</div>
       
 
         <a href="/createschool" class="btn btn-accent btn-wide">Create new school:</a>
 
     </div>
</div>











{/if}