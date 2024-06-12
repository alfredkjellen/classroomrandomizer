<script lang="ts">
    import { auth, user, userData, schoolData, db } from "$lib/firebase";
    import { doc, writeBatch, getDoc, updateDoc } from "firebase/firestore";

    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

    import { goto } from "$app/navigation";
    import GoogleSvg from "$lib/components/GoogleSvg.svelte";


    $: if ($userData)
    {
        email = $userData?.username || "";
    }
    else
    {
        email = auth.currentUser?.email || "";
    }

    let email = auth.currentUser?.email;
    let schoolName = "";
    let password = "";
    let schoolExists: any = undefined;
    $: isTouched = schoolName.length > 0 && password.length > 0;

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        email = auth.currentUser?.email;
    }

    async function handleLogin() {
        await checkSchool();
        if (schoolExists) {
            if ($schoolData?.name === schoolName) {
                
            } else {
                if (await checkPassword()) {
                    await confirmUser();
                    

                    goto("/randomizeroom");
                }
            }
        }
        else {

        }
    }

    async function confirmUser() {
        
        try {
            const batch = writeBatch(db);
            batch.set(doc(db, "usernames", String(email)), { uid: $user?.uid });
            batch.set(doc(db, "users", $user!.uid), {
                username: email,
                school: schoolName,
            });

            await batch.commit();
        } catch (error) {
            alert(error);
        }

        schoolName = "";
    }
    async function checkSchool() {
        const ref = doc(db, "schools", schoolName.trim());

        const docSnap = await getDoc(ref);

        schoolExists = docSnap.exists();
    
    }

    async function checkPassword() {
        const ref = doc(db, "schools", schoolName.trim());

        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return password === data?.password;
        }
    }
</script>

<div class="flex justify-center items-center mt-32">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        <h1 class="text-3xl font-bold self-center">Log in</h1>

        {#if $user}
            <button class="btn btn-primary"
                ><GoogleSvg/>{email}
            </button>
        {:else}
            <button class="btn btn-primary" on:click={signInWithGoogle}
                ><GoogleSvg/>
                Log in with Google</button
            >
        {/if}

        {#if $user}
            <label class="form-control">
                <div class="label">
                    <span class="label-text">School name</span>
                </div>

                <input class="input input-bordered" bind:value={schoolName} />
            </label>

            <label class="form-control">
                <div class="label">
                    <span class="label-text">Password</span>
                </div>

                <input
                    type="password"
                    class="input input-bordered"
                    bind:value={password}
                />

                {#if schoolExists === false}
                    <div class="label label-text text-warning">
                        {schoolName} doesn't exist
                    </div>
                    Create new?<a href="/signup" class="btn btn-accent btn-xs"
                        >Sign up</a
                    >
                {/if}
            </label>

            <button on:click={handleLogin} class="btn" class:btn-accent={isTouched} class:btn-disabled={!isTouched}>Log in</button>
        {/if}
    </div>
</div>
