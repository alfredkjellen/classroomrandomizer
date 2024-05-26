<script lang="ts">
    import { db, user, userData, schoolData } from "$lib/firebase";
    import { doc, getDoc, writeBatch, updateDoc } from "firebase/firestore";
    import { goto } from "$app/navigation";

    class Class {
        name: string;
        students: string[];

        constructor(name: string, students: string[]) {
            this.name = name;
            this.students = students;
        }
    }

    let className = "";
    let studentNames = "";
    let classes: any[] = [];
    let exampleStudents = "Student A\nStudent B\nStudent C";
    let isEditing = false;
    let originalName = "";
    let adding = false;


    $: if($schoolData) {
		classes = $schoolData?.classes || [];
	}

    //#region Validation

    $: nameIsTouched = className.length > 0;

    //#endregion

    //#region add Classes



    //region edit classes

    function selectClass(c: any) {
        className = c.name;
        originalName = c.name;
        studentNames = c.students.join("\n");
        isEditing = true;

        
    }


    function cancelEdit() {
        isEditing = false;
        className = "";
        studentNames = "";
    }

    //#endregion
    async function addClass() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");
        const newClass = new Class(className, students);
        
        className = "";
        studentNames = "";
        await confirmClasses(newClass);

    }

    async function confirmClasses(newClass: any) {
		if ($user) {
			adding = true;
            
			const schoolRef = doc(db, "schools", $userData!.school);
			const schoolSnap = await getDoc(schoolRef);

			if (schoolSnap.exists()) {
				const schoolData = schoolSnap.data();

                let updatedClasses = schoolData?.classes || [];
        		updatedClasses = updatedClasses.filter((c: any) => c.name !== originalName);
				

				updatedClasses.push({name: newClass.name, students: newClass.students});

                
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

    function switchNameOrder() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");
        const switchedStudents = students.map((student) => {
            let names:any = student.split(" ");
            let result = "";

            if (names.length > 1) {
                let firstName = names.shift();
                names.push(firstName);
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
</script>

<div class="flex justify-center mt-5 gap-5 items-stretch">

    <ul class="menu bg-base-200 w-56 rounded-box">

        {#each classes as c, i}
        <li>
        <button on:click={() => selectClass(c)}>{c.name}
        </button>

    </li>
    
            {/each}


      </ul>





    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        

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

        <div class="flex justify-stretch gap-2"><button class="btn btn-xs btn-primary" on:click={switchNameOrder}>Shift names<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
          </svg>
          </button></div>


        {#if isEditing}
        <button class="btn btn-accent mt-10" class:btn-disabled={!nameIsTouched} on:click={addClass}
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
