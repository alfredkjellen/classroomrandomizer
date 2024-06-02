<script lang="ts">
    import { user, schoolData } from "$lib/firebase";
    import {Student, Class, Seat, Room} from "$lib/classes.ts"

    import { svgColor } from "$lib/controller";

    let classA = new Class("Class A", [
  'Ryan Anderson',
  'Ella Anderson',
  'Michael Brown',
  'Jacob Conner',
  'Joshua Davis',
  'Emily Davis',
  'Nathan Garcia',
  'Madison Garcia',
  'Ethan Gonzalez',
  'Amellia Gonzalez',
  'Grace Jackson',
  'Joseph Johnson',
  'Isabella Johnson',
  'Matthew Jones',
  'Olivia Jones',
  'David Martinez',
  'Avery Martinez',
  'Ava Millar',
  'Daniel Miller',
  'Ariana Ramirez',
  'Noah Rodriguez',
  'Abigail Rodriguez',
  'Emma Smith',
  'John Thomas',
  'Sarah Thomas',
  'Andrew Wilson',
  'Sophia Williams',
  'Christopher Williams',
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

let i1:any = undefined;
let j1:any = undefined;
let i2:any = undefined;
let j2:any = undefined;


function handleClick(student: Student, event: MouseEvent, i : number, j: number) {
  event.stopPropagation(); // Prevent event from propagating to the window



    if(i1 === undefined && j1 === undefined)
    {
        i1 = i;
        j1 = j;
    }
    else if(i2 === undefined && j2 === undefined)
    {
        i2 = i;
        j2 = j;
    }

  let isClicked = student.isClicked;

  student.isClicked = !isClicked;
  currentRoom.layout = currentRoom.layout;



    if (clickedStudent1 === undefined && student.name !== "") {
        clickedStudent1 = student;
    } else if (clickedStudent2 === undefined && clickedStudent1 !== undefined) {
        clickedStudent2 = student;

        if(clickedStudent2.name === "")
        {
        moveStudents(clickedStudent1, clickedStudent2, i1, j1, i2, j2);
        }
        else{
            moveStudents(clickedStudent1, clickedStudent2);
        }


        clickedStudent1 = undefined;
        clickedStudent2 = undefined;
        i1 = undefined;
        j1 = undefined;
        i2 = undefined;
        j2 = undefined;

    }
}


function moveStudents(student1: Student, student2:Student, i1?: any, j1?: any, i2?: any, j2?: any)
{

    if(student2.name === "")
    {
        currentRoom.layout[i2][j2].student = student1;
        currentRoom.layout[i2][j2].student.isClicked = false;
        currentRoom.layout[i2][j2].student = {...currentRoom.layout[i2][j2].student};

        currentRoom.layout[i1][j1].student = new Student("");
        currentRoom.layout[i1][j1].student.isClicked = false;
        currentRoom.layout[i1][j1].student = {...currentRoom.layout[i1][j1].student};

        activeStudents = [];

        for(let i =0; i < currentRoom.layout.length; i++)
        {
            for(let j = 0; j < currentRoom.layout[i].length; j++)
            {

                if(currentRoom.layout[i][j].isAvailable)
                {
                activeStudents.push(currentRoom.layout[i][j].student);
                activeStudents = [...activeStudents];
                }
            }
        }

    }


    else{

    activeStudents = activeStudents.map((s: Student) => {
        if(s.name === student1.name)
        {
            s = student2;
        }
        else if(s.name === student2.name)
        {
            s = student1;
        }
        s.isClicked = false;
        return s;
    });

}

    activeStudents = [...activeStudents];

    updateRoom();
}






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
                else if(currentRoom.layout[i][j].isAvailable){

                    currentRoom.layout[i][j].student = new Student("");

                }
            }
        }

        activeStudents = [...activeStudents];
        
    }






    //#endregion



    //#region Zoom
    let boxWidth = 150;
    let boxHeight = 65;
    let factor = 0.05;

    function zoom(operation: string) {
        if(operation === "+")
        {
            boxWidth += boxWidth * factor;
            boxHeight += boxHeight * factor;
        }
        else if(operation === "-")
        {
            boxWidth -= boxWidth * factor;
            boxHeight -= boxHeight * factor;
        }
    }



    //#endregion


</script>

<div class="flex justify-center mt-1 gap-2">
    <div class="dropdown dropdown-hover">
        <div role="button" class="btn btn-wide btn-neutral">
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
            class="btn btn-wide btn-neutral"
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
        <button class="btn btn-wide btn-neutral"> Students </button>
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
                    class="btn btn-wide btn-warning btn-active no-animation"
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



    <div class="ml-5">

<button on:click={() => zoom("+")} class="btn btn-neutral"><svg class="w-[28px] h-[28px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={$svgColor} viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414ZM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm9-3a1 1 0 1 0-2 0v2H7a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V7Z" clip-rule="evenodd"/>
  </svg>
  
  </button>
<button on:click={() => zoom("-")} class="btn btn-neutral"><svg class="w-[28px] h-[28px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={$svgColor} viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414ZM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm4 0a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1Z" clip-rule="evenodd"/>
  </svg>
  </button>



    </div>



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
                    on:click={(event) => handleClick(currentRoom.layout[i][j].student, event, i, j)}
                    class={`btn btn-neutral text-2xl hover:text-primary hover:border-primary border-2 ${currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== "" ? 'border-primary text-primary' : ''}`}
                        style="width: {boxWidth}px; height: {boxHeight}px;"


                    >
                        {currentRoom.layout[i][j].student.name}
                       
                    </button>

                 


                </div>

    
    
                {:else}
                    <div
                        class="text-2xl btn btn-disabled "
                        style="width: {boxWidth}px; height: {boxHeight}px;"
                    ></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
