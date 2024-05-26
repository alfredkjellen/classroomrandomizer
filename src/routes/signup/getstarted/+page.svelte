<script lang="ts">
    import { db, user, userData, schoolData } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";
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
    let classes: Class[] = [];

    let exampleStudents = "Student A\nStudent B\nStudent C";

    //#region Validation

    $: nameIsTouched = className.length > 0;

    //#endregion

    //#region add Classes
    function addClass() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");
        const newClass = new Class(className, students);
        classes = [...classes, newClass];

        className = "";
        studentNames = "";
    }

    async function confirmClasses() {
        try {
            const userDocRef = doc(db, "schools", $userData!.school);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                let existingClasses = userData.classes || [];

                // Konvertera klassobjekten till JSON-strängar innan vi sparar dem
                const newClasses = classes.map((c) => ({
                    name: c.name,
                    students: c.students,
                }));

                // Lägg till nya klasser till befintliga klasser
                existingClasses = [...existingClasses, ...newClasses];

                const batch = writeBatch(db);
                batch.set(
                    userDocRef,
                    { classes: existingClasses },
                    { merge: true },
                );
                await batch.commit();

                classes = [];
                goto("/editclassrooms");
            } else {
                console.error("User data not found in database.");
            }
        } catch (error) {
            console.error("Error confirming classes:", error);
        }
    }

    //#endregion

    function switchNameOrder() {
        const students = studentNames
            .split("\n")
            .filter((name) => name.trim() !== "");
        const switchedStudents = students.map((student) => {
            const names = student.split(" ");
            let result = "";

            if (names.length > 1) {
                const middleNames = names.slice(1, names.length - 1).join(" ");
                result = `${names[names.length - 1]} ${middleNames} ${names[0]}`;
            } else {
                result = names[0];
            }

            //replace double spaces with single spaces
            result = result.replace(/\s+/g, " ");
            return result;
        });

        studentNames = switchedStudents.join("\n");
    }
</script>

<div class="flex justify-center items-center">
    <div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
        <h2 class="text-xl font-bold self-center">Enter class lists</h2>
        <div class="font-bold">
            Simply, paste in each class once at a time. You can do it later if
            you want
        </div>

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

        <span class="label-text">Switch order of first and last names: </span>

        <input type="checkbox" class="toggle" on:click={switchNameOrder}/>

        <button class="btn btn-accent mt-10" on:click={addClass}
            >Add class</button
        >

        <div class="divider">When you are done:</div>

        <button class="btn btn-accent btn-outline" on:click={confirmClasses}
            >Continue</button
        >
    </div>
</div>
