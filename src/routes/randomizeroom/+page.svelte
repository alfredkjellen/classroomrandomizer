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
    let rooms: Room[] = [];

    rooms = [room1, room2];
    classes = [class1];

    let exampleRoom = new Room("Choose room", []);
    let exampleClass = new Class("Choose class", []);

    let currentRoom = exampleRoom;
    let currentClass = exampleClass;
    let activeStudents:any = exampleClass.students.map(
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


    function selectRoom(room: Room) {
        currentRoom = room;
        selectClass(currentClass);
    }

    function selectClass(c: Class) {
        currentClass = c;

        allStudents = c.students.slice().map((student) => new Student(student));
        
        randomizedStudents = shuffleArray(allStudents.slice());

        activeStudents = randomizedStudents.slice();
        activeStudents = [...activeStudents];

        updateRoom();


       
    }

    $: if ($schoolData && $user) {
        classes = $schoolData?.classes ?? [];
        rooms = [];
        $schoolData.rooms.forEach((room: any) => {
            let array = JSON.parse(room.layout);
            let booleanArray: any[] = [];

            for (let i = 0; i < array.length; i++) {
                booleanArray[i] = [];
                for (let j = 0; j < array[i].length; j++) {
                    booleanArray[i][j] = Boolean(array[i][j]);
                }
            }

            for (var k = 0; k < booleanArray.length; k++) {}

            let seats: Seat[][] = [];
            for (let i = 0; i < booleanArray.length; i++) {
                seats[i] = [];
                for (let j = 0; j < booleanArray[i].length; j++) {
                    seats[i][j] = new Seat(booleanArray[i][j]);
                }
            }
            rooms = [...rooms, new Room(room.name, seats)];
        });
    }

    //#region Presense

    function handlePresense(student: Student) {
        student.isPresent = !student.isPresent;
        allStudents = [...allStudents];

        if(student.isPresent){
            activeStudents.push(student);
        }
        else{
            activeStudents = activeStudents.filter((s: Student) => s.name !== student.name);
        }

        activeStudents = [...activeStudents];
        updateRoom();
    }


    function updateRoom(){

        let studentList = activeStudents.slice();

        for(let i = 0; i < currentRoom.layout.length; i++){
            for(let j = 0; j < currentRoom.layout[i].length; j++){
                if(currentRoom.layout[i][j].isAvailable && studentList.length > 0)
                {
                    currentRoom.layout[i][j].student = studentList.shift();
                    currentRoom.layout[i][j].student = {...currentRoom.layout[i][j].student};
                }
                else{
                    currentRoom.layout[i][j].student = new Student("");
                }
            }
        }
        
    }






    //#endregion






</script>

<div class="flex justify-center">
    <div class="dropdown dropdown-hover">
        <div role="button" class="btn m-1 btn-wide btn-neutral">
            {currentRoom.name}
        </div>
        <ul
            class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
        >
            {#each rooms as room}
                <li>
                    <button on:click={() => selectRoom(room)}
                        >{room.name}</button
                    >
                </li>
            {/each}
        </ul>
    </div>

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
