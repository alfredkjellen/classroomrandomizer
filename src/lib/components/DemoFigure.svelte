<script lang="ts">
    
    import {Student, Class, Seat, Room} from "$lib/classes.ts"
    

    let classA = new Class("Class A", [
    "John",
    "Jane",
    "Michael",
    "Sara",
    "David",
    "Emily",
    "Daniel",
    "Olivia",
    "Matthew",
    "Ava",
    "William",
    "Sophia",
    "James",
    "Isabella",
    "Joseph",
    "Charlotte",
    "David",
    "Abigail",
    "Andrew",
    "Elizabeth",
    "Joshua",
    "Grace",
    "Daniel",
    "Emily",
    "Samuel",
    "Madison",
    "Christopher",
    "Chloe",
    "Andrew",
    "Victoria"
    ]);

    let room2 = new Room("Room 2", [
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
    ]);

    let room1 = new Room("Room 1", [
        [new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false), new Seat(false),new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true), new Seat(false),new Seat(true), new Seat(true)]
    ]);

    let classes: Class[] = [];
    let rooms: Room[] = [];

    rooms = [room1, room2];
    classes = [classA];

    let currentRoom = room1;
    let currentClass = classA;
    let activeStudents:any = currentClass.students.map(
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
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"/>
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
        <button class="btn m-1 btn-wide btn-neutral btn-sm"> Students </button></div>
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



<div class=" ml-60 mt-6">
    {#each currentRoom.layout as row, i}
        <div class="flex">
            {#each row as box, j}
                {#if box.isAvailable}
                    <button
                        class="btn btn-neutral text-xs btn-sm"
                        style="width: 100px;"
                        >{currentRoom.layout[i][j].student.name}</button
                    >
                {:else}
                    <div
                        class="btn btn-disabled text-2xl btn-sm"
                        style="width: 100px;"
                    ></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
