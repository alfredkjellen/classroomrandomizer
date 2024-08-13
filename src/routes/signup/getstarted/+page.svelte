<script lang="ts">
    import { userData, schoolData, db } from "$lib/firebase";
    import { doc, getDoc, updateDoc } from "firebase/firestore";

    async function activateFreeTrial() {
        const schoolRef = doc(
            db,
            "schools",
            $userData!.school,
            "schooldata",
            "data",
        );
        const schoolSnap = await getDoc(schoolRef);
        if (schoolSnap.exists()) {
            const currentDate = new Date();
            const trialEndDate = new Date(
                currentDate.getTime() + 31 * 24 * 60 * 60 * 1000,
            );
            await updateDoc(schoolRef, {
                subscribed: true,
                trialEndingDate: trialEndDate.toISOString(),
            });
        } else {
            alert("School data not found in database.");
        }
    }
</script>

<div class="flex justify-center items-center">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6">
        <h2 class="text-xl font-bold self-center">You are signed in!</h2>

        <div class="flex justify-evenly">
            <p>{$userData?.username}</p>
            <p>{$userData?.school}</p>
        </div>
        <div class="text-primary"></div>

        <div class="font-bold">
            <div>
                Share the school password with the other teachers in order to
                enable their access.
            </div>
            <br />

            <div class="flex justify-center">
                <button
                    on:click={activateFreeTrial}
                    class="btn btn-wide btn-primary btn-outline"
                    >Activate Free Trial (1 month)</button
                >
            </div>

            {#if $schoolData?.subscribed}
                <div>To start:</div>
                <u>
                    <li>
                        <a href="/editclasses" class="btn btn-link"
                            >Add classes</a
                        >
                    </li>

                    <li>
                        <a href="/editclassrooms" class="btn btn-link"
                            >Create classrooms</a
                        >
                    </li>
                </u>
            {/if}
        </div>
    </div>
</div>
