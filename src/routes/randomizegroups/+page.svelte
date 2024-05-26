<script lang="ts">
    import { user, schoolData } from "$lib/firebase";

    class Class {
        name: string;
        students: string[];
        constructor(name: string, students: string[]) {
            this.name = name;
            this.students = students;
        }
    }

    class Seat {
        student: Student = new Student("");
        isAvailable: boolean;

        constructor(isAvailable: boolean) {
            this.isAvailable = isAvailable;
        }
    }

    class Room {
        name: string;
        layout: Seat[][] = [];

        constructor(name: string, layout: Seat[][]) {
            this.name = name;
            this.layout = layout;
        }
    }

    class Student {
        name: string;
        isPresent: boolean = true;

        constructor(name: string = "") {
            this.name = name;
        }
    }

    let class1 = new Class("Class1", [
        "Student1",
        "Student2",
        "Student3",
        "Student4",
        "Student5",
        "Student6",
        "Student7",
        "Student8",
        "Student9",
        "Student10",
        "Student11",
        "Student12",
        "Student13",
        "Student14",
        "Student15",
        "Student16",
        "Student17",
        "Student18",
        "Student19",
        "Student20",
    ]);

    let room1 = new Room("Room1", [
        [new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(true), new Seat(true), new Seat(true)],
    ]);

    let room2 = new Room("Room2", [
        [new Seat(true), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true)],
    ]);

    let classes: Class[] = [];
    classes = [class1];
    let exampleClass = new Class("Choose class", []);

    let layout: boolean[][] = [];
    for (let i = 0; i < 40; i++) {
        let row: boolean[] = [];
        for (let j = 0; j < 40; j++) {
            row.push(false);
        }
        layout.push(row);
    }

    let students: Seat[][] = layout.map((row) =>
        row.map((seat: any) => new Seat(false)),
    );

    let exampleRoom = new Room("Choose room", students);

    let currentRoom = exampleRoom;
    let currentClass = exampleClass;
    let activeStudents: any = exampleClass.students.map(
        (student) => new Student(student),
    );
    let allStudents: Student[] = [];
    let randomizedStudents: Student[] = [];

    let studentsNotAssigned: Student[] = [];

    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function selectClass(c: Class) {
        currentClass = c;

        allStudents = c.students.slice().map((student) => new Student(student));

        randomizedStudents = shuffleArray(allStudents.slice());

        activeStudents = randomizedStudents.slice();
        activeStudents = [...activeStudents];

        updateStudents();
    }

    $: if ($schoolData && $user) {
        classes = $schoolData?.classes ?? [];
    }

    //#region Presense

    function handlePresense(student: Student) {
        student.isPresent = !student.isPresent;
        allStudents = [...allStudents];

        if (student.isPresent) {
            activeStudents.push(student);
        } else {
            activeStudents = activeStudents.filter(
                (s: Student) => s.name !== student.name,
            );
        }

        activeStudents = [...activeStudents];
        updateStudents();
    }

    function updateStudents() {
        let studentList = activeStudents.slice();

        for (let i = 0; i < currentRoom.layout.length; i++) {
            for (let j = 0; j < currentRoom.layout[i].length; j++) {
                if (
                    currentRoom.layout[i][j].isAvailable &&
                    studentList.length > 0
                ) {
                    currentRoom.layout[i][j].student = studentList.shift();
                    currentRoom.layout[i][j].student = {
                        ...currentRoom.layout[i][j].student,
                    };
                } else {
                    currentRoom.layout[i][j].student = new Student("");
                }
            }
        }
    }

    //#endregion

    //#region Groups


    $:{
        if(groupSize < 1){
            groupSize = undefined;
        }

        if(groupSize > currentClass.students.length)
        {
            groupSize = currentClass.students.length;
        }

    }

    let groupSize: any = 4;
    let colAmounts:any = {1: 5, 2: 3, 3: 2, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1}; 
    let loading = false;

    function updateLayout() {
        if (groupSize > 0 && currentClass.students.length > 0 && groupSize !== undefined && !loading) {
            loading = true;
            let positions = currentClass.students.length;
            let i = 0;

            currentRoom.layout.map((row) =>
                row.map((seat) => (seat.isAvailable = false)),
            );

            while (positions > 0) {
                let a = 0;
                for (let c = 0; c < colAmounts[groupSize]; c++) {
                    for (let j = 0; j < groupSize; j++) {
                        if (positions <= 0) {
                            break;
                        }
                        currentRoom.layout[i][j + c*groupSize + a].isAvailable = true;
                        positions -= 1;
                    }
                    a += 1; // Add a gap of 1 between columns
                }
                i += 2;
            }

            currentRoom.layout = [...currentRoom.layout];
            selectClass(currentClass);
            loading = false;
        }
    }

    //#endregion
</script>

<div class="flex justify-center">
    
    <div class="dropdown dropdown-hover">
        <button
            class="btn m-1 btn-wide btn-neutral"
            on:click={() => selectClass(currentClass)}
        >
            {currentClass.name}
        </button>
        <ul
            class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
        >
            {#each classes as c}
                <li>
                    <button on:click={() => selectClass(c)}>{c.name}</button>
                </li>
            {/each}
        </ul>
    </div>



    <label class="input input-bordered flex items-center gap-2 mt-1 font-bold text-sm">
        Group size:
        <input
            bind:value={groupSize}
        on:input={updateLayout}
            type="text"
            class="grow w-12"
        />
    </label>



    <div class="dropdown dropdown-hover">
        <button class="btn m-1 btn-wide btn-neutral"> Students </button>

        <ul
            class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-auto"
        >
            <div class=" menu-title flex justify-end">Present</div>
            {#each allStudents as student}
                <li>
                    <button
                        on:click={() => handlePresense(student)}
                        class="flex justify-end"
                        >{student.name}
                        <input
                            type="checkbox"
                            bind:checked={student.isPresent}
                            class=" checkbox checkbox-md"
                        /></button
                    >
                </li>
            {/each}
        </ul>
    </div>

    {#if studentsNotAssigned.length > 0 && currentRoom.name !== "Choose room"}
        <div>
            <div class="dropdown dropdown-hover">
                <div
                    role="button"
                    class="btn m-1 btn-wide btn-warning btn-active no-animation"
                >
                    Students not assigned
                </div>
                <ul
                    class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
                >
                    {#each studentsNotAssigned as student}
                        <li>
                            <button>{student.name}</button>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    {/if}
</div>

<div>
    {#each currentRoom.layout as row, i}
        <div class="flex">
            {#each row as box, j}
                {#if box.isAvailable}
                    <button
                        class="btn btn-neutral h-16 text-2xl"
                        style="width: 150px;"
                        >{currentRoom.layout[i][j].student.name}</button
                    >
                {:else}
                    <div
                        class="btn btn-disabled h-16 text-2xl"
                        style="width: 150px;"
                    ></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
