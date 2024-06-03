<script lang="ts">
    import { onMount } from 'svelte';
    import { Student, Class, Seat, Room } from "$lib/classes.ts";
    import { browser } from "$app/environment";

let mounted = false;

onMount(() => {
    if (browser) {
        window.addEventListener("click", resetClickedStatus);
        mounted = true;
    }

    return () => {
        if (mounted && browser) {
            window.removeEventListener("click", resetClickedStatus);
        }
    };
});

    onMount(() => {
        window.addEventListener("click", resetClickedStatus);
    });



    function renderRoom() {
        currentRoom.layout = currentRoom.layout.map((row) =>
            row.map((seat) => {
                seat.student = { ...seat.student };
                seat = { ...seat };
                return seat;
            }),
        );
    }


    let classA = new Class("Class A", [
  'Abigail',
  'Amellia',
  'Andrew',
  'Anthony',
  'Ariana',
  'Ava',
  'Avery',
  'Christopher',
  'Daniel',
  'David',
  'Ella',
  'Emily',
  'Emma',
  'Ethan',
  'Grace',
  'Harper',
  'Isabella',
  'Jacob',
  'John',
  'Joseph',
  'Joshua',
  'Madison',
  'Matthew',
  'Michael',
  'Nathan',
  'Noah',
  'Olivia',
  'Ryan',
  'Sarah',
  'Sophia'
]);

    let room2 = new Room("Room 2", [
        [
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(true),
            new Seat(true),
        ],
    ]);

    let room1 = new Room("Room 1", [
        [
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
        ],
        [
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
            new Seat(false),
        ],
        [
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
            new Seat(false),
            new Seat(true),
            new Seat(true),
        ],
    ]);

    let classes: Class[] = [];
    let rooms: Room[] = [];

    rooms = [room1, room2];
    classes = [classA];

    let currentRoom = room1;
    let currentClass = classA;
    let activeStudents: any = currentClass.students.map(
        (student) => new Student(student),
    );
    let allStudents: Student[] = [];
    let randomizedStudents: Student[] = [];


    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function selectRoom(room: Room) {
        currentRoom = room;
        if(currentClass.name !== "Choose class"){
            selectClass(currentClass);
        }

    }

    function selectClass(c: Class) {
        currentClass = c;

        allStudents = c.students.slice().map((student) => new Student(student));

        randomizedStudents = shuffleArray(allStudents.slice());
        updateRoom();
    }

    
    function resetClickedStatus() {
        currentRoom.layout.forEach((row) => {
            row.forEach((seat) => {
                seat.student.isClicked = false;
            });
        });

        clickedStudent1 = undefined;
        clickedStudent2 = undefined;
        renderRoom();
    }


    onMount(() => {
        window.addEventListener("click", resetClickedStatus);
        
    });


    let clickedStudent1: any = undefined;
    let clickedStudent2: any = undefined;
    let i1: any = 0;
    let j1: any = 0;
    let i2: any = 0;
    let j2: any = 0;

    function handleClick(
        student: Student,
        event: MouseEvent,
        i: number,
        j: number,
    ) {
        event.stopPropagation();
        student.isClicked = !student.isClicked;
        currentRoom.layout[i][j].student = { ...student };

        if (student.isClicked) {
            if (clickedStudent1 === undefined && student.name !== "") {
                clickedStudent1 = student;
                i1 = i;
                j1 = j;
            } else if (clickedStudent2 === undefined && clickedStudent1 !== undefined) {
                clickedStudent2 = student;
                i2 = i;
                j2 = j;
                moveStudents(clickedStudent1, clickedStudent2);
                resetClickedStatus();
            }
        }
    }

    function moveStudents(student1: any, student2: any) {
        let temp = currentRoom.layout[i1][j1].student;
        currentRoom.layout[i1][j1].student = currentRoom.layout[i2][j2].student;
        currentRoom.layout[i2][j2].student = temp;
    }

    function updateRoom() {
        let studentList: any = randomizedStudents.slice();

        for (let i = 0; i < currentRoom.layout.length; i++) {
            for (let j = 0; j < currentRoom.layout[i].length; j++) {
                if (
                    currentRoom.layout[i][j].isAvailable &&
                    studentList.length > 0
                ) {
                    currentRoom.layout[i][j].student = studentList.shift()!;
                } else if (currentRoom.layout[i][j].isAvailable) {
                    currentRoom.layout[i][j].student = new Student("");
                }
            }
        }
    }

    function handlePresense(student: Student) {
        student.isClicked = false;
        if (student.isPresent) {

            //remove student from room
            for (let i = 0; i < currentRoom.layout.length; i++) {
                for (let j = 0; j < currentRoom.layout[i].length; j++) {
                    if (
                        currentRoom.layout[i][j].student.name === student.name
                    ) {
                        currentRoom.layout[i][j].student = new Student("");
                        allStudents = allStudents.map((s) => {
                            if (s.name === student.name) {
                                s.isPresent = false;
                            }
                            return s;
                        });


                    }
                }
            }

            //fill the gap of the student

            let studentList:any = [];
            for (let i = 0; i < currentRoom.layout.length; i++) {
                for (let j = 0; j < currentRoom.layout[i].length; j++) {
                    if (
                        currentRoom.layout[i][j].isAvailable &&
                        currentRoom.layout[i][j].student.name !== ""
                    ) {
                        studentList.push(currentRoom.layout[i][j].student);
                    }
                }
            }

            for (let i = 0; i < currentRoom.layout.length; i++) {
                for (let j = 0; j < currentRoom.layout[i].length; j++) {
                    if (
                        currentRoom.layout[i][j].isAvailable && studentList.length > 0
                    ) {
                        currentRoom.layout[i][j].student = studentList.shift();
                    }
                    else{
                        currentRoom.layout[i][j].student = new Student("");
                    }
                }
            }




        } else {
            //add student to room

            let found = false;
            for (let i = 0; i < currentRoom.layout.length; i++) {
                for (let j = 0; j < currentRoom.layout[i].length; j++) {
                    if (
                        currentRoom.layout[i][j].isAvailable &&
                        currentRoom.layout[i][j].student.name === "" && !found
                    ) {
                        currentRoom.layout[i][j].student = student;
                        found = true;
                        break;
                    }
                }
            }

            
        }

    }


    //#endregion
</script>

<div class="flex justify-center">
    <div class="dropdown dropdown-hover">
        <div class="tooltip tooltip-open" data-tip="Select room">
            <div role="button" class="btn m-1 btn-wide btn-neutral btn-sm">
                {currentRoom.name}
            </div>
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
        <div class="tooltip tooltip-open tooltip-accent" data-tip="Randomize">
            <button
                class="btn m-1 btn-wide btn-neutral btn-sm"
                on:click={() => selectClass(currentClass)}
            >
                {currentClass.name}
                <button class="btn btn-xs btn-accent">
                    <svg
                        class="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
                        />
                    </svg>
                </button>
            </button>
        </div>

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
        <div class="tooltip tooltip-open" data-tip="Check presense">
            <button class="btn m-1 btn-wide btn-neutral btn-sm">
                Students
            </button>
        </div>
        {#if currentClass.name !== "Choose class"}
            <ul
                class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-auto"
            >
                <div class=" menu-title flex justify-end">Present</div>

                {#each allStudents as student}
                    <li>
                        <button
                            on:click={() => handlePresense(student)}
                            class="flex justify-end btn btn-sm"
                            >{student.name}
                            <input
                                type="checkbox"
                                bind:checked={student.isPresent}
                                class="checkbox checkbox-md"
                            /></button
                        >
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

   
</div>

<div class=" ml-72 mt-6">
    {#each currentRoom.layout as row, i}
        <div class="flex">
            {#each row as box, j}
                {#if box.isAvailable}
                    
                
                <div class="indicator">
                    <div class="indicator-item indicator-top">
                        {#if currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== ""}
                        <button
                        on:click={() => handlePresense(currentRoom.layout[i][j].student)}
                         class="btn btn-xs btn-circle btn-warning ">✕</button>
                        {/if}
                      </div> 

                    <button
                    on:click={(event) => handleClick(currentRoom.layout[i][j].student, event, i, j)}
                    class={`btn btn-neutral text-xs btn-sm hover:text-primary hover:border-primary border-2 ${currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== "" ? 'border-primary text-primary' : ''}`}
                        style="width: 98px;"


                    >
                        {currentRoom.layout[i][j].student.name}
                       
                    </button>

                 


                </div>

                    
                {:else}
                    <div
                        class="btn btn-disabled btn-sm"
                        style="width: 98px;"
                    ></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
