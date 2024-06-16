<script lang="ts">
    import { auth, user, userData, schoolData, db } from "$lib/firebase";
    import {
        doc,
        writeBatch,
        getDoc,
        updateDoc,
        deleteField,
    } from "firebase/firestore";

    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

    import GoogleSvg from "$lib/components/GoogleSvg.svelte";

    let isLoggedIn = false;

    $: if ($schoolData) {
        isLoggedIn = true;
    }

    $: if ($userData) {
        email = $userData?.username || "";
    } else {
        email = auth.currentUser?.email || "";
    }

    let email = auth.currentUser?.email;
    let schoolName = "";
    let password = "";
    let schoolExists: any = undefined;
    $: isTouched = schoolName.length > 0 && password.length > 0;
    let isCorrectPassword = true;

    function resetStatus() {
        isCorrectPassword = true;
        schoolExists = undefined;
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        email = auth.currentUser?.email;
    }

    async function handleLogin() {
        await checkSchool();
        if (schoolExists) {
            if (!$schoolData) {
                await confirmUser();
            }
        }
    }

    //TODO FIX THIS
    async function confirmUser() {
        try {
            const batch = writeBatch(db);
            batch.set(doc(db, "usernames", String(email)), { uid: $user?.uid });
            batch.set(doc(db, "users", $user!.uid), {
                username: email,
            });

            batch.set(doc(db, "users", $user!.uid, "userdata", "data"), {
                username: email,
                school: schoolName,
                password: password,
            });

            await batch.commit();
        } catch (error) {
            const batch = writeBatch(db);

            batch.update(doc(db, "users", $user!.uid, "userdata", "data"), {
                username: email,
                school: schoolName,
                password: password,
            });

            await batch.commit();

            
        }


        if (await checkLogin()) {
            schoolName = "";
            isLoggedIn = true;
            isCorrectPassword = true;
        } else {
            try {
                isCorrectPassword = false;
            } catch (error) {
                //alert(error);
            }
        }

        password = "";
    }

    async function checkLogin() {
        try {
            const schoolRef = doc(db, "schools", schoolName, "schooldata", "data");
            const schoolSnap = await getDoc(schoolRef);
            const schoolData = schoolSnap.data();
            return true;

        } catch(error) {
            return false;
        }
    }




    async function checkSchool() {
        const ref = doc(db, "schools", schoolName.trim());

        const docSnap = await getDoc(ref);

        schoolExists = docSnap.exists();
    }
</script>

<div class="flex justify-center items-center mt-32">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 text-center">
        <h1 class="text-3xl font-bold self-center btn-wide">Log in</h1>

        {#if $user}
            <button class="btn btn-primary"><GoogleSvg />{email} </button>
        {:else}
            <button class="btn btn-primary" on:click={signInWithGoogle}
                ><GoogleSvg />
                Log in with Google</button
            >
        {/if}

        {#if $user && !isLoggedIn}
            <label class="form-control">
                <div class="label">
                    <span class="label-text">School name</span>
                </div>

                <input
                    class="input input-bordered"
                    bind:value={schoolName}
                    on:input={resetStatus}
                />
            </label>

            <label class="form-control">
                <div class="label">
                    <span class="label-text">Password</span>
                </div>

                <input
                    type="password"
                    class="input input-bordered"
                    bind:value={password}
                    on:input={resetStatus}
                />

                {#if schoolExists === false}
                    <div class="label label-text text-warning">
                        {schoolName} doesn't exist
                    </div>
                    Create new?<a href="/signup" class="btn btn-warning btn-xs"
                        >Sign up</a
                    >
                {/if}
            </label>

            <button
                on:click={handleLogin}
                class="btn"
                class:btn-accent={isTouched}
                class:btn-disabled={!isTouched}>Log in</button
            >

            {#if !isCorrectPassword}
                <div class="label label-text text-error">
                    Incorrect password
                </div>
            {/if}
        {/if}

        {#if isLoggedIn}
            <div class="flex justify-center">
                <div class="label font-bold gap-1">
                    Logged in to <span class="text-primary">
                        {$userData?.school}</span
                    >
                </div>
            </div>

            <div class="flex justify-center">
                <a
                    class="btn btn-wide btn-primary btn-outline"
                    href="/randomizeroom">Go to randomizer</a
                >
            </div>
        {/if}
    </div>
</div>
