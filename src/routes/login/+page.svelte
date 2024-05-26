<script lang="ts">
    import { auth, user, userData, schoolData, db } from "$lib/firebase";
    import { doc, writeBatch, getDoc, updateDoc } from "firebase/firestore";

    import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

    import { goto } from "$app/navigation";


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
                
                alert("Already logged in");
                //goto("/roomrandomizer");
            } else {
                if (await checkPassword()) {
                    await confirmUser();
                    
                    alert("Password correct");
                    //goto("/roomrandomizer");
                }
            }
        }
        else {
            alert(schoolExists);
        }
    }
    //TODO CHECK IF USER ALREADY EXISTS
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
        alert(schoolName);
    
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

<div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        <h1 class="text-3xl font-bold self-center">Log in</h1>

        {#if $user}
            <button class="btn btn-primary"
                ><svg
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
                </svg>{email}
            </button>
        {:else}
            <button class="btn btn-primary" on:click={signInWithGoogle}
                ><svg
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
                Log in with Google</button
            >
        {/if}

        <!-- {#if $user} -->
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
        <!-- {/if} -->
    </div>
</div>
