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


    <div class="flex justify-center items-center min-h-screen">
        <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
            <h1 class="text-3xl font-bold self-center">Log in</h1>

            <span class="self-center">
                Don't have an account?
                <a href="/createaccount" class="link link-accent">Register</a>
            </span>

            <button class="btn btn-primary" on:click={signInWithGoogle}
                >Sign in with Google</button
            >

            <div class="divider"></div>

            <label class="form-control">
                <div class="label">
                    <span class="label-text">School name</span>
                </div>

                <input class="input input-bordered" />
            </label>

            <label class="form-control">
                <div class="label">
                    <span class="label-text">Password</span>
                    <a
                        href="/forgotpassword"
                        class="label-text link link-accent">Forgot password?</a
                    >
                </div>

                <input type="password" class="input input-bordered" />
            </label>

           

            <button class="btn btn-primary">Log in</button>
        </div>
    </div>



