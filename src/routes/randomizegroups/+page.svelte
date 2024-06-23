<script lang="ts">
    import { user, schoolData } from "$lib/firebase";
    import {Student, Class, Seat, Room} from "$lib/classes.ts"
    import { svgColor } from "$lib/controller";


  //   let classA = new Class("Class1", [
        
  // 'Ryan Anderson',
  // 'Ella Anderson',
  // 'Michael Brown',
  // 'Jacob Conner',
  // 'Joshua Davis',
  // 'Emily Davis',
  // 'Nathan Garcia',
  // 'Madison Garcia',
  // 'Ethan Gonzalez',
  // 'Amellia Gonzalez',
  // 'Grace Jackson',
  // 'Joseph Johnson',
  // 'Isabella Johnson',
  // 'Matthew Jones',
  // 'Olivia Jones',
  // 'David Martinez',
  // 'Avery Martinez',
  // 'Ava Millar',
  // 'Daniel Miller',
  // 'Ariana Ramirez',
  // 'Noah Rodriguez',
  // 'Abigail Rodriguez',
  // 'Emma Smith',
  // 'John Thomas',
  // 'Sarah Thomas',
  // 'Andrew Wilson',
  // 'Sophia Williams',
  // 'Christopher Williams',

  //   ]);


  let classA = new Class("Class A", [
      "Adam",
      "Alex",
      "Alice",
      "Alfred",
      "Ava",
      "Ben",
      "Bob",
      "Chris",
      "Clara",
      "Daniel",
      "David",
      "Edward",
      "Emily",
      "Ethan",
      "Grace",
      "Harry",
      "Isac",
      "Jack",
      "John",
      "Joe",
      "Josh",
      "Matt",
      "Molly",
      "Nathan",
      "Noah",
      "Ryan",
      "Sam",
      "Sarah",
      "Toby",
      "Will",
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
    classes = [classA];
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






    
//#region Clicked events

let clickedStudent1:any = undefined;
let clickedStudent2: any = undefined;


$: moveable = (clickedStudent1 !== undefined && clickedStudent2 === undefined) || (clickedStudent2 !== undefined && clickedStudent1 === undefined); 

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

        clickedStudent1 = undefined;
        clickedStudent2 = undefined;
        
    }
}



function moveStudents(student1: Student, student2:Student)
{


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
    activeStudents = [...activeStudents];

    updateStudents();
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


    function checkGroupSize(){


        if (groupSize < 1)
        {
            groupSize = undefined;
        }
        else if(groupSize > currentClass.students.length)
        {
            groupSize = currentClass.students.length;
        }
    }


    $:{


        if(currentClass.students.length > 0)
        {
        checkGroupSize();
      }

    }

    let groupSize: any = 4;
    let colAmounts:any = {1: 5, 2: 3, 3: 2, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1}; 

    function updateLayout() {
        if (groupSize > 0 && currentClass.students.length > 0 && groupSize !== undefined) {
            let positions = currentClass.students.length;
            let i = 0;

            checkGroupSize();

            let colAmount = colAmounts[groupSize] ?? 1;


            // Reset all seats
            currentRoom.layout.map((row) =>
                row.map((seat) => (seat.isAvailable = false)),
            );

            while (positions > 0) {
                let a = 0;
                for (let c = 0; c < colAmount; c++) {
                    for (let j = 0; j < groupSize; j++) {
                        if (positions <= 0) {
                            break;
                        }
                        currentRoom.layout[i][j + c*groupSize + a].isAvailable = true;
                        positions -= 1;
                    }
                    a += 1; // Add a gap of 1 between columns
                }
                i += 2; // Add a gap of 1 between rows
            }

            currentRoom.layout = [...currentRoom.layout];
            selectClass(currentClass);
        }
    }

    //#endregion






    //#region Zoom
    let boxWidth = 150;
    let boxHeight = 75;
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



    function update(c:Class)
    {
        selectClass(c);
        updateLayout();
    }


function handleClassSelection(event:any) {
  const selectedClassName = event.target.value;
  const selectedClass = classes.find(c=> c.name === selectedClassName);
  selectClass(selectedClass!);

  //updating the layout
  updateLayout();
}



//#region student presense
let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function closeDropdown(event:any) {
    const dropdownMenu = document.getElementById("dropdown-menu")!;
    const dropdownButton = document.getElementById("dropdown-button")!;

    if (
      !dropdownMenu.contains(event.target) &&
      !dropdownButton.contains(event.target)
    ) {
      isDropdownOpen = false;
    }
  }






//#endregion







function increaseGroupSize()
{
    groupSize += 1;
    updateLayout();
}
function decreaseGroupSize()
{

    if(groupSize > 1)
    {
    groupSize -= 1;
    updateLayout();
    }
    
}



</script>


<style>
    /* Styles for larger screens */
    .menu-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  
    /* Styles for smaller screens */
    @media (max-width: 768px) {
      .menu-container {
        flex-direction: column;
        gap: 0.5rem;
      }
  
      .select,
      .input {
        width: 100%;
        max-width: none;
      }
  
      .btn-container {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
    }
  </style>

<svelte:window on:click={closeDropdown} />

  <div class="menu-container">
    <select class="select select-bordered w-full max-w-xs" on:change={handleClassSelection}>
      <option disabled selected>Choose class</option>
      {#each classes as c}
      <option value={c.name}>{c.name}</option>
      {/each}
    </select>
  
    <label class="input input-bordered flex items-center gap-2 text-sm">
      Group size:
      <input bind:value={groupSize} on:input={updateLayout} type="text" class="grow w-7" />

  
  </label>

  <div>
    <div>
  <button on:click={increaseGroupSize} class="btn btn-sm btn-neutral">+</button>
</div>

<div>
  <button on:click={decreaseGroupSize} class="btn btn-sm btn-neutral">-</button>
</div>
</div>



  
    <div class="relative inline-block">
      <button id="dropdown-button" class="select select-bordered w-56 flex items-center justify-start" on:click={toggleDropdown}>
        Students
      </button>
      {#if isDropdownOpen}
      <div id="dropdown-menu" class="absolute z-10 mt-2 w-full bg-base-200 rounded-md shadow-lg">
        <ul class="py-1 text-sm">
          {#each allStudents as student}
          <li>
            <div class="flex justify-between px-4 py-2">
              {student.name}
              <input type="checkbox" bind:checked={student.isPresent} class="checkbox checkbox-md" on:click={() => handlePresense(student)} />
            </div>
          </li>
          {/each}
        </ul>
      </div>
      {/if}
    </div>
  
    <div class="btn-container">
      <button on:click={() => zoom("+")} class="btn btn-neutral">
        <svg class="w-[28px] h-[28px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={$svgColor} viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414ZM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm9-3a1 1 0 1 0-2 0v2H7a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V7Z" clip-rule="evenodd" />
        </svg>
      </button>
      <button on:click={() => zoom("-")} class="btn btn-neutral">
        <svg class="w-[28px] h-[28px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={$svgColor} viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414ZM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm4 0a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
  
  <div class="mt-4">
    {#each currentRoom.layout as row, i}
    <div class="flex">
      {#each row as box, j}
      {#if box.isAvailable}
      <div class="indicator">
        <div class="indicator-item indicator-top">
          {#if currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== ""}
          <button on:click={() => handlePresense(currentRoom.layout[i][j].student)} class="btn btn-sm btn-circle btn-warning">✕</button>
          {/if}
        </div>
  
        <button on:click={(event) => handleClick(currentRoom.layout[i][j].student, event)} class={`btn btn-neutral text-2xl hover:text-primary hover:border-primary border-2 ${currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== "" ? 'border-primary text-primary' : ''}`} style="width: {boxWidth}px; height: {boxHeight}px;">
          {currentRoom.layout[i][j].student.name}
        </button>
      </div>
      {:else}
      <div class="btn btn-disabled text-2xl" style="width: {boxWidth}px; height: {boxHeight}px;"></div>
      {/if}
      {/each}
    </div>
    {/each}
  </div>
