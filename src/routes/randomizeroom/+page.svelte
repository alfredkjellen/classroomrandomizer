<script lang="ts">
    import { user, schoolData } from "$lib/firebase";
    import {Student, Class, Seat, Room} from "$lib/classes.ts"

    let classA = new Class("Class A", [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Sara Davis",
    "David Wilson",
    "Emily Brown",
    "Daniel Taylor",
    "Olivia Martinez",
    "Matthew Anderson",
    "Ava Thomas",
    "William Garcia",
    "Sophia Robinson",
    "James Clark",
    "Isabella Lewis",
    "Joseph Lee",
    "Charlotte Walker",
    "David Hernandez",
    "Abigail Hall",
    "Andrew Young",
    "Elizabeth Allen",
    "Joshua King",
    "Grace Hill",
    "Daniel Scott",
    "Emily Green",
    "Samuel Baker",
    "Madison Adams",
    "Christopher Turner",
    "Chloe Mitchell",
    "Andrew Rodriguez",
    "Victoria Turner"
    ]);

    let room2 = new Room("Room 2", [
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(true), new Seat(true), new Seat(true), new Seat(true), new Seat(false), new Seat(true), new Seat(true), new Seat(true), new Seat(true)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)],
        [new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false), new Seat(false)]
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

    
    let clickedStudent1:any = undefined;
let clickedStudent2: any = undefined;




function resetClickedStatus() {
  currentRoom.layout.forEach(row => {
    row.forEach(seat => {
      seat.student.isClicked = false;
    });
  });

    clickedStudent1 = undefined;
    clickedStudent2 = undefined;
  currentRoom.layout = currentRoom.layout; // Trigger reactivity
}

window.addEventListener('click', resetClickedStatus);

function handleClick(student: Student, event: MouseEvent) {
  event.stopPropagation(); // Prevent event from propagating to the window

  let isClicked = student.isClicked;

  student.isClicked = !isClicked;
  currentRoom.layout = currentRoom.layout;



    if (clickedStudent1 === undefined && student.name !== "") {
        clickedStudent1 = student;
    } else if (clickedStudent2 === undefined && clickedStudent1 !== undefined) {
        clickedStudent2 = student;
        moveStudents(clickedStudent1, clickedStudent2);
        clickedStudent1.isClicked = false;
        clickedStudent2.isClicked = false;
        clickedStudent1 = undefined;
        clickedStudent2 = undefined;
        
    }
}



function moveStudents(student1: Student, student2:Student)
{
    currentRoom.layout = currentRoom.layout.map((row) => row.map((box) => {
       
       
       
       
       
        if(box.student === student1)
        {
            box.student = student2;
        }
        else if(box.student === student2)
        {
            box.student = student1;
        }
        return box;
    }));


}





//#endregion


//#region Presense


    function handlePresense(student: Student) {
        student.isPresent = !student.isPresent;

        student.isClicked = false;
        currentRoom.layout = currentRoom.layout;

        allStudents = allStudents.map((s) => {
        if (s.name === student.name) {
            return student;
        }
        return s;
    });

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
            <button class="btn btn-sm btn-accent">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"/>
                  </svg>
                </button>
          
              
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


<div class="divider font-bold">Front of classroom</div>


<div>
    {#each currentRoom.layout as row, i}
        <div class="flex">
            {#each row as box, j}
                {#if box.isAvailable}
                    
                
                <div class="indicator">
                    <div class="indicator-item indicator-top">
                        {#if currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== ""}
                        <button
                        on:click={() => handlePresense(currentRoom.layout[i][j].student)}
                         class="btn btn-sm btn-circle btn-warning ">✕</button>
                        {/if}
                      </div> 

                    <button
                    on:click={(event) => handleClick(currentRoom.layout[i][j].student, event)}
                    class={`btn btn-neutral h-16 text-2xl hover:text-primary hover:border-primary border-2 ${currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== "" ? 'border-primary text-primary' : ''}`}
                        style="width: 150px;"


                    >
                        {currentRoom.layout[i][j].student.name}
                       
                    </button>

                 


                </div>

                    
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
