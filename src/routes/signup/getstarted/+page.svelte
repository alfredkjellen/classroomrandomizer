<script lang="ts">
import { auth, user, userData, schoolData, db } from "$lib/firebase";


</script>



<div class="flex justify-center items-center">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-1/3">
        <h2 class="text-xl font-bold self-center">You are signed in!</h2>

        <div class="flex justify-evenly"><p>{$userData?.username}</p> <p>{$userData?.school}</p></div>
        <div class="text-primary"></div>
        

        
        <div class="font-bold">
            To start:
            <u>
                <li>

                    <a href="/editclasses" class="btn btn-link">Add classes</a>
                </li>

                <li>

                    <a href="/editclassrooms" class="btn btn-link">Create classrooms</a>
                </li>



                




            </u>
            
        </div>


        





       
    </div>
</div>
