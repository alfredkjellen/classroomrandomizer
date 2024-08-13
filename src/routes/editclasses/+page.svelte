<script lang="ts">
    import { db, user, userData, schoolData } from "$lib/firebase";
    import { doc, getDoc, writeBatch, updateDoc } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import {Class} from "$lib/classes.ts"

    let className = "";
    let studentNames = "";
    let classes: any[] = [];
    let exampleStudents = "Student A\nStudent B\nStudent C";
    let isEditing = false;
    let originalName = "";
    let adding = false;

    let currentClass: Class = new Class("", []); 


    $: if($schoolData) {
		classes = $schoolData?.classes || [];
	}

    //#region Validation

    $: nameIsTouched = className.length > 0;

    //#endregion

    //#region getId

    function createId()
    {
        return Math.random().toString(36).slice(2);
    }



    //#endregion



    //region edit classes

    function selectClass(c: any) {
        
        if(c.id === "" || c.id === undefined)
        {
            c.id = createId();
        }
        
        currentClass = c;

        //
        className = c.name;
        originalName = c.name;
        studentNames = c.students.join("\n");
        isEditing = true;
    }


    function cancelEdit() {
        isEditing = false;
        className = "";
        studentNames = "";
        originalName = "";
    }


    async function editClass() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");

        const newClass = new Class(className, students, currentClass.id);
        
        className = "";
        studentNames = "";
        await confirmClasses(newClass);
        isEditing = false;
    }



    //#endregion



    //#region add Classes
    async function addClass() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");

        
        let newId = createId();
        const newClass = new Class(className, students, newId);
        
        className = "";
        studentNames = "";
        await confirmClasses(newClass);
        isEditing = false;
    }

    async function confirmClasses(newClass: any) {
		if ($user) {
			adding = true;
            
			const schoolRef = doc(db, "schools", $userData!.school, "schooldata", "data");
			const schoolSnap = await getDoc(schoolRef);

			if (schoolSnap.exists()) {
				const schoolData = schoolSnap.data();

                let updatedClasses = schoolData?.classes || [];
        		
                if(isEditing)
                {
                    updatedClasses = updatedClasses.filter((c: any) => c.id !== currentClass.id);
                }
                
				updatedClasses.push({name: newClass.name, students: newClass.students, id: newClass.id});

				await updateDoc(schoolRef, { classes:updatedClasses });
                isEditing = false;
                
			} 
			else {
				alert("School data not found in database.");
			}


			adding = false;
		}
	}

    //#endregion




    //#region delete classes

    async function deleteClass(c : any)
    {
        
        if(c !== undefined)
        {
            const schoolRef = doc(db, "schools", $userData!.school, "schooldata", "data");
			const schoolSnap = await getDoc(schoolRef);

			if (schoolSnap.exists()) {
				const schoolData = schoolSnap.data();

                let updatedClasses = schoolData?.classes || [];
        		
                updatedClasses = updatedClasses.filter((class_: any) => class_.name  !== c.name);
                
				await updateDoc(schoolRef, { classes:updatedClasses });
                isEditing = false;
                
			} 
			else {
				alert("School data not found in database.");
			}


            cancelEdit();
        }

    }




    //#endregion




    function switchNameOrder() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");
        const switchedStudents = students.map((student) => {
            let names:any = student.split(" ");
            let result = "";

            if (names.length > 1) {

                let lastName = names.pop();
                names.unshift(lastName);
                
                result = names.join(" ");
            } else {
                result = names[0];
            }

            result = result.replace(/\s+/g, " ");
            result = result.trim();
            return result;
        });

        studentNames = switchedStudents.join("\n");
    }

    let isDeleting = false;

</script>



<div class="flex justify-center mt-5 gap-5 items-stretch">
    <ul class="menu bg-base-200 w-56 rounded-box">

<div class="flex self-end">

    <label class="swap swap-flip text-9xl mt-1 mb-3">
        <!-- this hidden checkbox controls the state -->
        <input bind:checked={isDeleting} type="checkbox" />
      
        <div class="swap-on"><svg class="w-6 h-6 text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z" clip-rule="evenodd"/>
          </svg>
          </div>
        <div class="swap-off"><svg class="w-6 h-6 text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>

          </div>
      </label>
</div>

        {#each classes as c, i}
        <div class="flex justify-between">
        <li>        
        <button class=" w-44" on:click={() => selectClass(c)} >{c.name}</button>
        </li>
        {#if isDeleting}
        <button on:click={() => deleteClass(c)}>
        <svg class="w-6 h-6 hover:text-red-600 text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
          </svg>
        </button>
        {/if}


        </div>
            {/each}
      </ul>


    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        <button on:click={() => deleteClass(currentClass)} class={`self-end btn btn-sm ${isEditing ? "btn-error": "btn-disabled"}`}>Delete class</button>

        <label class="form-control">
            
            
            <div class="label">
                <span class="label-text">Name of class</span>
            </div>

            <input
                class="input input-bordered"
                type="text"
                bind:value={className}
            />
        </label>
        <label class="form-control">
            <div class="label">
                <span class="label-text">Students</span>
            </div>

            <textarea
                class="textarea textarea-bordered h-20"
                placeholder={exampleStudents}
                bind:value={studentNames}
            ></textarea>
        </label>

        <div class="flex justify-stretch gap-2"><button class="btn btn-xs btn-primary" on:click={switchNameOrder}>Shift names<svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
          </svg>
          </button></div>


        {#if isEditing}
        <button class="btn btn-accent mt-10" class:btn-disabled={!nameIsTouched} on:click={editClass}
        >Save</button

    >
    <button on:click={cancelEdit} class="btn btn-sm btn-warning opacity-60 w-28 self-end">Cancel</button>

        {:else}

        <button class="btn btn-primary mt-10" class:btn-disabled={!nameIsTouched} on:click={addClass}
            >Add class</button
        >
        
        {/if}

    </div>
</div>
