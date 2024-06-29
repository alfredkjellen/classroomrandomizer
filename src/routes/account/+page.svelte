<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import SignOutButton from "$lib/components/SignOutButton.svelte";
    import { signOut } from "firebase/auth";
    import { auth, user, userData, schoolData, db } from "$lib/firebase";
    import {
        doc,
        writeBatch,
        getDoc,
        deleteDoc,
        deleteField,
    } from "firebase/firestore";
    import {
        getAuth,
        deleteUser as deleteAuthUser,
        GoogleAuthProvider,
        reauthenticateWithCredential,
    } from "firebase/auth";


    let inputValue = "";
    let userIsDeleted = false;

    function resetInput() {
        inputValue = "";
    }

    async function deleteSchool() {
        if (inputValue == $schoolData!.name) {
            try {
                const batch = writeBatch(db);

                batch.delete(doc(db, "schools", $schoolData!.name));
                batch.update(doc(db, "users", $user!.uid, "userdata", "data"), {
                    school: deleteField(),
                    password: deleteField(),
                });

                await batch.commit();

                resetInput();
            } catch (e) {
                alert(e);
            }
        }
    }

    async function deleteUser() {
        if (inputValue == "Delete") {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                // Delete username
                const userNameDocRef = doc(
                    db,
                    "usernames",
                    $userData?.username!,
                );
                await deleteDoc(userNameDocRef);



                 // Delete userdata
                 const userDataDocRef = doc(
                    db,
                    "users",
                    currentUser.uid!,
                    "userdata",
                    "data",
                );
                await deleteDoc(userDataDocRef);

                // Delete user
                const userDocRef = doc(db, "users", currentUser.uid!);
                await deleteDoc(userDocRef);
                

                signOut(auth);
                userIsDeleted = true;

                // Reset the input value
                inputValue = "";
                userIsDeleted = true;
            }
        } catch (e) {
            alert(e);
        }
    }
    }
</script>

<AuthCheck userIsDeleted={userIsDeleted}>

    <div class="flex justify-center mt-5 gap-10">
        <div class="flex gap-4 rounded-box bg-base-200 p-6 w-2/5">
            <div class="card-body">
                <div class=" card-title">Account</div>

                <div class="text-primary">
                    {$userData?.username}
                </div>

                <div>
                    <div class="badge badge-neutral text-sm">{$schoolData?.name}</div>
                    
                </div>

                <div class="card-actions justify-end">
                    <SignOutButton></SignOutButton>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-center mt-5 gap-10">
        <div class="flex gap-4 rounded-box bg-base-200 p-6 w-2/5">
            <div class="card-body">
                <div class="card-title">Manage User</div>

                <div class="card-actions mt-10 justify-end">
                    <button
                        class="btn btn-error btn-outline btn-sm"
                        onclick="my_modal_2.showModal()">Delete user</button
                    >
                    <dialog id="my_modal_2" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button
                                    on:click={resetInput}
                                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    >✕</button
                                >
                            </form>
                            <h3 class="font-bold text-warning">
                                This action will delete the user with the email:
                                <p class=" text-primary">
                                    {$userData?.username}
                                </p>
                            </h3>

                            <div class="mt-10 font-bold">
                                Note that this action does not affect the status
                                of the main school account:
                                <p class="text-primary">{$schoolData?.name}</p>
                            </div>

                            <div class="card-actions justify-start mt-10">
                                <p class=" label-text">
                                    Type {"Delete"} to Delete
                                </p>

                                <div class="join">
                                    <input
                                        bind:value={inputValue}
                                        class="input input-bordered join-item"
                                        placeholder="Delete"
                                    />
                                    <button
                                        on:click={deleteUser}
                                        class="btn btn-error join-item"
                                        >Delete</button
                                    >
                                </div>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-center mt-5 gap-10">
        <div class="flex gap-4 rounded-box bg-base-200 p-6 w-2/5">
            <div class="card-body">
                <div class="card-title">Manage School</div>

                <div class="card-actions mt-10 justify-end items-center">
                    {#if $schoolData}
                        <button
                            class="btn btn-error btn-outline btn-sm"
                            onclick="my_modal_3.showModal()"
                            >Delete school</button
                        >
                        <dialog id="my_modal_3" class="modal">
                            <div class="modal-box">
                                <form method="dialog">
                                    <button
                                        on:click={resetInput}
                                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                        >✕</button
                                    >
                                </form>
                                <h3 class="font-bold text-warning">
                                    This action will delete the school with the
                                    name:
                                    <p class=" text-primary">
                                        {$schoolData?.name}
                                    </p>
                                </h3>

                                <div class="mt-10 font-bold">
                                    Note that this action does not delete your
                                    account;
                                    <p class="text-primary">
                                        {$userData?.username}
                                    </p>
                                </div>

                                <div class="card-actions justify-start mt-10">
                                    <p class=" label-text">
                                        Type {$schoolData.name} to confirm
                                    </p>

                                    <div class="join">
                                        <input
                                            bind:value={inputValue}
                                            class="input input-bordered join-item"
                                            placeholder={$schoolData.name}
                                        />
                                        <button
                                            on:click={deleteSchool}
                                            class="btn btn-error join-item"
                                            >Delete</button
                                        >
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    {:else}
                        No school found
                        <a href="/signup" class="btn btn-accent btn-sm"
                            >Create new school</a
                        >
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div class="mt-80"><Footer /></div>
</AuthCheck>