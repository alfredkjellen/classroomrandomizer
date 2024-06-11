<script lang="ts">
    import { auth, userData } from "$lib/firebase";
    import { db, user } from "$lib/firebase";
    import { doc, getDoc, writeBatch, query } from "firebase/firestore";
    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { goto } from "$app/navigation";
    import GoogleSvg from "$lib/components/GoogleSvg.svelte";
    import { page } from "$app/stores";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        email = auth.currentUser?.email;
    }

    $: if ($userData)
    {
        email = $userData?.username || "";
    }
    else
    {
        email = auth.currentUser?.email || "";
    }

    let email:any = "";
    let schoolName = "";
    let loading = false;
    let isAvailable = false;

    const regex = /^(?=[a-zA-Z0-9._]{3,25}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    let debounceTimer: NodeJS.Timeout;

    $: isValid = regex.test(schoolName);
    $: isTouched = schoolName.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

    async function checkAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);

        loading = true;

        debounceTimer = setTimeout(async () => {
            try {
                // Ensure schoolName is valid
                if (schoolName && schoolName.trim() !== "") {

                    const ref = doc(db, "schools", schoolName.trim());
                    // Fetch the document
                    const docSnap = await getDoc(ref);
                    // Check if the document exists
                    isAvailable = !docSnap.exists();
                }
            } catch (error) {
                alert(error);
            } finally {
                // Ensure loading is set to false regardless of success or failure
                loading = false;
            }
        }, 400);
    }

    function handleSignUp() {
        if (userIsReady) {
            confirmUser();
            goto("signup/getstarted")
        }
    }

    async function confirmUser() {
    
        try {
            const batch = writeBatch(db);
            batch.set(doc(db, "usernames", String(email)), { uid: $user?.uid });
            batch.set(doc(db, "users", $user!.uid), {
                username: String(email),
                school: schoolName,
            });
            batch.set(doc(db, "schools", schoolName), {
                name: schoolName,
            });

            batch.set(doc(db, "schools", schoolName, "schooldata", "data"),
            {
                name: schoolName,password: password,
            });

            await batch.commit();
        } catch (error) {
            alert(error);
        }

        schoolName = "";
        isAvailable = false;
    }

    // password implementation
    let password = "";
    let confirmedPassword = "";
    let loadingPassword = false;

    const passwordRegex = /^[^\s]{8,}$/;

    $: passwordIsMatching = password === confirmedPassword;
    $: passwordIsValid = passwordRegex.test(password);
    $: passwordIsTouched = password.length > 0;
    $: matchingPasswordIsTouched = confirmedPassword.length > 0;

    $: userIsReady =
        isValid && isAvailable && passwordIsValid && passwordIsMatching;

    async function validatePassword() {
        loadingPassword = true;
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            loadingPassword = false;
        }, 600);
    }

</script>



<div class="flex justify-center items-center">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        <h1 class="text-3xl font-bold self-center">Sign up</h1>

        {#if !$user}
        <button class="btn btn-accent" on:click={signInWithGoogle}>
            <GoogleSvg/>
            Sign in with Google</button
        >

        {:else}
        <div style="cursor: default;" class="btn btn-accent no-animation btn-active">
            <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fill-rule="evenodd"
                    d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                    clip-rule="evenodd"
                />
            </svg>
            {email}</div>

        


        {/if}




        {#if $user}
        <label class="form-control">
            <div class="label">
                <span class="label-text"
                    >Enter name of school or organization</span
                >
            </div>

            <input
                class="input input-bordered"
                type="text"
                bind:value={schoolName}
                on:input={checkAvailability}
                class:input-error={!isValid && isTouched && !loading}
                class:input-warning={isTaken && !loading}
                class:input-success={isAvailable && isValid && !loading}
            />
        </label>

        <div class="label">
            {#if !isValid && isTouched && !loading}
                <p class="text-error text-sm">
                    3-25 characters, no spaces, only letters and numbers
                </p>
            {/if}

            {#if isValid && !isAvailable && !loading}
                <p class="text-warning text-sm">
                    {schoolName} is taken
                </p>
            {/if}

            {#if isAvailable && isValid}
                <p class="text-success text-sm">
                    {schoolName} is available
                </p>
            {/if}
        </div>

        <label class="form-control">
            <div class="label">
                <span class="label-text"
                    >Choose password - same for every user (teachers and staff)</span
                >
            </div>

            <input
                type="password"
                class="input input-bordered"
                bind:value={password}
                on:input={validatePassword}
                class:input-error={!passwordIsValid &&
                    passwordIsTouched &&
                    !loadingPassword}
                class:input-success={passwordIsValid &&
                    passwordIsTouched &&
                    !loadingPassword}
            />
            <div class="label">
            <span class="label-text"
            >Password must be at least 8 characters long</span
        ></div>

        </label>

        <label class="form-control">
            <div class="label">
                <span class="label-text">Confirm password</span>
            </div>

            <input
                type="password"
                class="input input-bordered"
                bind:value={confirmedPassword}
                on:input={validatePassword}
                class:input-success={passwordIsMatching &&
                    !loadingPassword &&
                    passwordIsTouched &&
                    matchingPasswordIsTouched}
                class:input-error={!passwordIsMatching &&
                    passwordIsTouched &&
                    matchingPasswordIsTouched &&
                    !loadingPassword &&
                    passwordIsValid}
            />
        </label>

        <button
            class="btn"
            class:btn-accent={userIsReady}
            class:btn-disabled={!userIsReady}
            on:click={handleSignUp}>Sign up</button
        >

        {/if}
    </div>
</div>
