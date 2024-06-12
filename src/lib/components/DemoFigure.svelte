<script lang="ts">
    import { onMount } from "svelte"
    import { Student, Class, Seat, Room } from "$lib/classes.ts"
    import { browser } from "$app/environment"
  
    let mounted = false
  

    onMount(() => {
      if (browser) {
        window.addEventListener("click", resetClickedStatus)
    window.addEventListener("resize", handleResize)
        mounted = true
      }
  
      return () => {
        if (mounted && browser) {
          window.removeEventListener("click", resetClickedStatus)
          window.removeEventListener("resize", handleResize)
        }
      }
    })
  
  
    function renderRoom() {
      currentRoom.layout = currentRoom.layout.map((row) =>
        row.map((seat) => {
          seat.student = { ...seat.student }
          seat = { ...seat }
          return seat
        }),
      )
    }
  
    let classA = new Class("Class A", [
      "Abigail",
      "Amellia",
      "Andrew",
      "Anthony",
      "Ariana",
      "Ava",
      "Avery",
      "Christopher",
      "Daniel",
      "David",
      "Ella",
      "Emily",
      "Emma",
      "Ethan",
      "Grace",
      "Harper",
      "Isabella",
      "Jacob",
      "John",
      "Joseph",
      "Joshua",
      "Madison",
      "Matthew",
      "Michael",
      "Nathan",
      "Noah",
      "Olivia",
      "Ryan",
      "Sarah",
      "Sophia",
    ])
  
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
    ])
  
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
    ])
  
    let classes: Class[] = []
    let rooms: Room[] = []
  
    rooms = [room1, room2]
    classes = [classA]
  
    let currentRoom = room1
    let currentClass = classA
    let activeStudents: any = currentClass.students.map(
      (student) => new Student(student),
    )
    let allStudents: Student[] = []
    let randomizedStudents: Student[] = []
  
    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
    function selectRoom(room: Room) {
      currentRoom = room
      if (currentClass.name !== "Choose class") {
        selectClass(currentClass)
      }
    }
  
    function selectClass(c: Class) {
      currentClass = c
  
      allStudents = c.students.slice().map((student) => new Student(student))
  
      randomizedStudents = shuffleArray(allStudents.slice())
      updateRoom()
    }
  
    function resetClickedStatus() {
      currentRoom.layout.forEach((row) => {
        row.forEach((seat) => {
          seat.student.isClicked = false
        })
      })
  
      clickedStudent1 = undefined
      clickedStudent2 = undefined
      renderRoom()
    }
  

  
    let clickedStudent1: any = undefined
    let clickedStudent2: any = undefined
    let i1: any = 0
    let j1: any = 0
    let i2: any = 0
    let j2: any = 0
  
    function handleClick(
      student: Student,
      event: MouseEvent,
      i: number,
      j: number,
    ) {
      event.stopPropagation()
      student.isClicked = !student.isClicked
      currentRoom.layout[i][j].student = { ...student }
  
      if (student.isClicked) {
        if (clickedStudent1 === undefined && student.name !== "") {
          clickedStudent1 = student
          i1 = i
          j1 = j
        } else if (
          clickedStudent2 === undefined &&
          clickedStudent1 !== undefined
        ) {
          clickedStudent2 = student
          i2 = i
          j2 = j
          moveStudents(clickedStudent1, clickedStudent2)
          resetClickedStatus()
        }
      }
    }
  
    function moveStudents(student1: any, student2: any) {
      let temp = currentRoom.layout[i1][j1].student
      currentRoom.layout[i1][j1].student = currentRoom.layout[i2][j2].student
      currentRoom.layout[i2][j2].student = temp
    }
  
    function updateRoom() {
      let studentList: any = randomizedStudents.slice()
  
      for (let i = 0; i < currentRoom.layout.length; i++) {
        for (let j = 0; j < currentRoom.layout[i].length; j++) {
          if (currentRoom.layout[i][j].isAvailable && studentList.length > 0) {
            currentRoom.layout[i][j].student = studentList.shift()!
          } else if (currentRoom.layout[i][j].isAvailable) {
            currentRoom.layout[i][j].student = new Student("")
          }
        }
      }
    }
  
    function handlePresense(student: Student) {
      student.isClicked = false
      if (student.isPresent) {
        //remove student from room
        for (let i = 0; i < currentRoom.layout.length; i++) {
          for (let j = 0; j < currentRoom.layout[i].length; j++) {
            if (currentRoom.layout[i][j].student.name === student.name) {
              currentRoom.layout[i][j].student = new Student("")
              allStudents = allStudents.map((s) => {
                if (s.name === student.name) {
                  s.isPresent = false
                }
                return s
              })
            }
          }
        }
  
        //fill the gap of the student
  
        let studentList: any = []
        for (let i = 0; i < currentRoom.layout.length; i++) {
          for (let j = 0; j < currentRoom.layout[i].length; j++) {
            if (
              currentRoom.layout[i][j].isAvailable &&
              currentRoom.layout[i][j].student.name !== ""
            ) {
              studentList.push(currentRoom.layout[i][j].student)
            }
          }
        }
  
        for (let i = 0; i < currentRoom.layout.length; i++) {
          for (let j = 0; j < currentRoom.layout[i].length; j++) {
            if (currentRoom.layout[i][j].isAvailable && studentList.length > 0) {
              currentRoom.layout[i][j].student = studentList.shift()
            } else {
              currentRoom.layout[i][j].student = new Student("")
            }
          }
        }
      } else {
        //add student to room
  
        let found = false
        for (let i = 0; i < currentRoom.layout.length; i++) {
          for (let j = 0; j < currentRoom.layout[i].length; j++) {
            if (
              currentRoom.layout[i][j].isAvailable &&
              currentRoom.layout[i][j].student.name === "" &&
              !found
            ) {
              currentRoom.layout[i][j].student = student
              found = true
              break
            }
          }
        }
      }
    }
  
    //#endregion


    //#region screen width
    let screenWidth = 1440;
    $:if(browser) {
       screenWidth = window.innerWidth;
    }
    let lgBtnFactor = 0.3;
    let lgBtnSize = 259;
    let smBtnSize = 98;
    let smBtnFactor = 0.10;

    function handleResize() {
      if(browser) {
        screenWidth = window.innerWidth
      }

    }
  
//#endregion
    



function handleRoomSelection(event:any) {
  const selectedRoomName = event.target.value;
  const selectedRoom = rooms.find(room => room.name === selectedRoomName);
  selectRoom(selectedRoom!);
}



function handleClassSelection(event:any) {
  const selectedClassName = event.target.value;
  const selectedClass = classes.find(c=> c.name === selectedClassName);
  selectClass(selectedClass!);
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






  </script>
  
<svelte:window on:click={closeDropdown} />

  <div class="flex justify-center"><button on:click={()=>selectClass(currentClass)} class="btn btn-xs btn-accent mb-3">
    Randomize<svg
      class="w-6 h-6 text-gray-800"
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
</div>
  <div class="flex justify-center items-center">

    <select class="select select-sm select-bordered w-52 max-w-xs" on:change={handleRoomSelection}>
      <option disabled selected>Choose room</option>
      {#each rooms as room}
        <option value={room.name}>{room.name}</option>
      {/each}
    </select>

    <select class="select select-sm select-bordered w-52 max-w-xs" on:change={handleClassSelection}>
      <option disabled selected>Choose class</option>
      {#each classes as c}
        <option value={c.name}>{c.name}</option>
      {/each}
    </select>

    
  
    <div class="relative inline-block">
      <button
        id="dropdown-button"
        class="select select-sm w-40 sm:w-52 select-bordered flex items-center justify-start"
        
        on:click={toggleDropdown}
      >
        Students
      </button>
      {#if isDropdownOpen}
      <div
        id="dropdown-menu"
        class="absolute z-10 mt-2 w-full bg-base-200 rounded-md shadow-lg"
      >
        <ul class="py-1 text-sm">
          {#each allStudents as student}
          <li>
            <div class="flex justify-between px-4 py-2">
              {student.name}
              <input
                type="checkbox"
                bind:checked={student.isPresent}
                class="checkbox checkbox-md"
                on:click={() => handlePresense(student)}
              />
            </div>
          </li>
          {/each}
        </ul>
      </div>
      {/if}
    </div>




  </div>
  
  <div class="flex justify-center items-center">
    <div class="mt-2">
      {#each currentRoom.layout as row, i}
        <div class="flex">
          {#each row as box, j}
            {#if box.isAvailable}
              <div class="indicator">
                <div class="indicator-item indicator-top">
                  {#if currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== ""}
                    <button
                      on:click={() =>
                        handlePresense(currentRoom.layout[i][j].student)}
                      class="btn btn-xs btn-circle btn-warning">✕</button
                    >
                  {/if}
                </div>
  
                <button
                  on:click={(event) =>
                    handleClick(currentRoom.layout[i][j].student, event, i, j)}
                  class={`btn btn-neutral text-xs btn-sm hover:text-primary hover:border-primary border-2 ${currentRoom.layout[i][j].student.isClicked && currentRoom.layout[i][j].student.name !== "" ? "border-primary text-primary" : ""}`}
                  style={`width: ${screenWidth < 768 ? `${screenWidth * smBtnFactor}px` : `${smBtnSize}px`};`}
                >
              
                  {currentRoom.layout[i][j].student.name}
                </button>
              </div>
            {:else}
              <div class="btn btn-disabled btn-sm" style={`width: ${screenWidth < 768 ? `${screenWidth * smBtnFactor}px` : `${smBtnSize}px`};`}></div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
  