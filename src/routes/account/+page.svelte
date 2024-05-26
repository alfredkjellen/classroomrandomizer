<script>
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import SignOutButton from "$lib/components/SignOutButton.svelte";
    import { userData } from "$lib/firebase";
</script>

<AuthCheck>
    <div class="flex justify-center mt-5 gap-10">
        <div class="flex gap-4 rounded-box bg-base-200 p-6 w-2/5">
            <div class="card-body">
                <div class=" card-title">
                    Account
                </div>
                
                <div class="text-primary">{$userData?.username}</div>
                <div class="">
                    
                    <div class="badge badge-neutral text-sm">
                        School:

                    </div>
 {$userData?.school}</div>

                <div class="card-actions justify-end">
                    <SignOutButton></SignOutButton>
                </div>
            </div>
        </div>
    </div>
</AuthCheck>
