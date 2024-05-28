<script lang="ts">
    import { user, schoolData } from "$lib/firebase";
    import { Student, Class, Room, Seat } from "$lib/classes.ts";

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
        checkGroupSize();
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
                        class="flex justify-end btn btn-sm"
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
