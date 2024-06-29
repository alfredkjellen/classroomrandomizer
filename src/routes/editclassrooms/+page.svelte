<script lang="ts">
	import { onMount } from "svelte";
	import { db, user, userData, schoolData } from "$lib/firebase";
	import { doc, getDoc, updateDoc } from "firebase/firestore"; // TOOD use writeBatch aswell
	import { Room } from "$lib/classes.ts";

	let classroomName = "";
	let layout: boolean[][] = [];

	let editingLength = 18;
	let editingWidth = 18;

	for (let i = 0; i < editingLength; i++) {
		let row: boolean[] = [];
		for (let j = 0; j < editingWidth; j++) {
			row.push(false);
		}
		layout.push(row);
	}

	//#region MouseEvents
	let mouseDown = false;
	window.addEventListener("mousedown", () => (mouseDown = true));
	window.addEventListener("mouseup", () => (mouseDown = false));

	function handleMousePress(i: any, j: any) {
		if (mouseDown) {
			layout[i][j] = !layout[i][j];
		}
	}

	function handleMouseDown(i: any, j: any) {
		mouseDown = true;
		layout[i][j] = !layout[i][j];
	}

	//#endregion

	//#region Classroom functions
	async function addClassroom() {
		if ($user) {
			adding = true;

			const schoolRef = doc(
				db,
				"schools",
				$userData!.school,
				"schooldata",
				"data",
			);
			const schoolSnap = await getDoc(schoolRef);

			if (schoolSnap.exists()) {
				const schoolData = schoolSnap.data();

				let newLayout = compressLayout(layout);

				const newRoom = {
					name: classroomName,
					layout: JSON.stringify(newLayout),
				};

				let updatedRooms = schoolData.rooms || [];

				if (isEditing) {
					updatedRooms = updatedRooms.filter(
						(room: any) => room.name !== originalName,
					);
				}

				updatedRooms.push(newRoom);

				await updateDoc(schoolRef, { rooms: updatedRooms });

				cancelEdit();
			} else {
				alert("School data not found in database.");
			}

			adding = false;
		}
	}

	function clearAllBoxes() {
		layout = layout.map((row) => row.map((box) => false));
	}

	$: amountOfSeats = layout.flat().filter((box) => box).length;

	function compressLayout(layout: boolean[][]) {
		const rows = layout.length;
		const cols = layout[0].length;
		const adjustedLayout: boolean[][] = [];

		let maxY = 0;
		let maxX = 0;
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (layout[y][x]) {
					if (y > maxY) {
						maxY = y;
					}
					if (x > maxX) {
						maxX = x;
					}
				}
			}
		}

		let minY = 100;
		let minX = 100;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (layout[y][x]) {
					if (y < minY) {
						minY = y;
					}
					if (x < minX) {
						minX = x;
					}
				}
			}
		}

		let length = maxY - minY + 1;
		let width = maxX - minX + 1;

		for (let i = 0; i < length; i++) {
			adjustedLayout.push(Array(width).fill(false));
		}

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (layout[y][x]) {
					adjustedLayout[y - minY][x - minX] = true;
				}
			}
		}

		return adjustedLayout;
	}

	function expandLayout(layout: boolean[][]) {}

	//#endregion

	//#region Animation
	const animations = [
		[2, 2],
		[6, 4],
		[10, 6],
		[2, 6],
		[6, 4],
		[10, 2],
	];

	const checkBoxTime = 30;
	const endAnimationTime = 300;
	const animationIntervalTime = 300;
	const startTime = 400;

	function startBoxAnimation(column: number, row: number) {
		let index = column;
		const interval = setInterval(() => {
			const i = row;
			const j = index % layout[0].length;
			layout[i][j] = true;
			index++;
			if (index >= column + 4) {
				clearInterval(interval);
				setTimeout(() => {
					endBoxAnimation(column, row);
				}, endAnimationTime);
			}
		}, checkBoxTime);
	}

	function endBoxAnimation(column: number, row: number) {
		let index = column;
		const interval = setInterval(() => {
			const i = row;
			const j = index % layout[0].length;
			layout[i][j] = false;
			index++;
			if (index >= column + 4) {
				clearInterval(interval);
			}
		}, checkBoxTime);
	}

	onMount(() => {
		setTimeout(() => {}, startTime);

		animations.forEach((animation, index) => {
			setTimeout(
				() => {
					startBoxAnimation(animation[0], animation[1]);
				},
				animationIntervalTime * (index + 1),
			);
		});
	});

	//#endregion

	//#region Validation
	const regex = /^(?=[a-zA-Z0-9._]{1,25}$)(?!.*[_.]{2})[^_.].*[^_.]$/; //TODO
	let debounceTimer: NodeJS.Timeout;

	let loading = false;
	let isAvailable = false;
	let adding = false;

	$: isValid = regex.test(classroomName);
	$: isTouched = classroomName.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;
	$: isReady = isAvailable && isValid;

	async function checkAvailability() {
		isAvailable = false;
		clearTimeout(debounceTimer);
		let exists = false;
		loading = true;

		debounceTimer = setTimeout(async () => {
			const schoolRef = doc(
				db,
				"schools",
				$userData!.school,
				"schooldata",
				"data",
			);
			const schoolSnap = await getDoc(schoolRef);

			if (schoolSnap.exists()) {
				const schoolRooms = schoolSnap.data().rooms || [];

				exists = schoolRooms.some(
					(room: Room) => room.name === classroomName,
				);
			}

			isAvailable = !exists;
			loading = false;
		}, 400);
	}

	//#endregion

	//#region editRooms

	let isEditing = false;
	let rooms: any[] = [];
	let originalName = "";
	$: if ($schoolData) {
		rooms = $schoolData?.rooms || [];
	}

	function editRoom(event: any) {
		const selectedRoomName = event.target.value;
		const selectedRoom = rooms.find(
			(room) => room.name === selectedRoomName,
		);

		if (selectedRoom && !adding) {
			isEditing = true;
			originalName = selectedRoom.name;
			classroomName = selectedRoom.name;
			let originalLayout = JSON.parse(selectedRoom.layout);

			// Adjust the layout
			clearAllBoxes();
			for (let i = 0; i < originalLayout.length; i++) {
				for (let j = 0; j < originalLayout[i].length; j++) {
					layout[i][j] = originalLayout[i][j];
				}
			}
		}

		mouseDown = false;
	}

	function editRoomByName(r: any) {
		let room = r;

		if (!adding) {
			isEditing = true;
			originalName = room.name;
			classroomName = room.name;
			layout = JSON.parse(room.layout);
		}
	}

	function cancelEdit() {
		isEditing = false;
		classroomName = "";
		originalName = "";
		clearAllBoxes();
	}

	//#endregion
</script>

<div class="flex justify-center gap-4">
	<div
		class="flex justify-stretch p-6 gap-4 rounded-box bg-base-200 w-3/7 mt-5"
	>
		<select on:change={editRoom} class="select select-bordered mt-9">
			<option disabled selected={!isEditing}>Choose room</option>
			{#each rooms as room}
				<option value={room.name}>{room.name}</option>
			{/each}
		</select>

		<label class="form-control">
			<div class="label">
				<span class="label-text">Enter classroom name or id</span>
			</div>
			<input
				class="input input-bordered"
				bind:value={classroomName}
				on:input={checkAvailability}
				class:input-error={!isValid && isTouched && !loading}
				class:input-warning={isTaken && !loading && !isEditing}
				class:input-success={isReady}
			/>
			<div class="label">
				{#if !isValid && isTouched && !loading}
					<p class="text-error text-sm">
						3-25 characters, no spaces, only letters and numbers
					</p>
				{/if}
				{#if isTaken && !isEditing}
					<p class="text-warning text-sm">
						{classroomName} already exists
					</p>
					<button
						class="btn btn-xs btn-accent"
						on:click={() =>
							editRoomByName(
								rooms.find(
									(room) => room.name === classroomName,
								),
							)}>Edit {classroomName}</button
					>
				{:else if isEditing}
					<p class="text-primary text-sm">
						Editing {originalName}
					</p>

					<button
						class="btn btn-primary btn-xs"
						on:click={cancelEdit}
					>
						Cancel</button
					>
				{/if}
			</div>
		</label>

		{#if !isEditing}
			<button
				class={`btn ${isReady && amountOfSeats ? "btn-primary" : "btn-disabled"} btn-wide mt-9`}
				on:click={addClassroom}
			>
				{#if adding}
					<span class="loading loading-ring loading-lg"></span>
				{:else}
					Add classroom
				{/if}
			</button>
		{:else}
			<button
				class={`btn ${isValid && amountOfSeats ? "btn-accent" : "btn-disabled"} btn-wide mt-9`}
				on:click={addClassroom}
			>
				{#if adding}
					<span class="loading loading-ring loading-lg"></span>
				{:else}
					Save
				{/if}
			</button>
		{/if}
	</div>
</div>

<div class="flex justify-end p-3 gap-3">
	<div class="badge badge-neutral mt-1.5">
		{amountOfSeats} seats selected
	</div>
	<button class="btn btn-sm btn-warning" on:click={clearAllBoxes}
		>Clear boxes</button
	>
</div>

<div class="divider text-lg font-bold">Front of classroom</div>

<div class="">
	{#each layout as row, i}
		<div class="flex">
			{#each row as box, j}
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<button
					on:mouseover={() => handleMousePress(i, j)}
					on:mousedown={() => handleMouseDown(i, j)}
					class={`btn ${layout[i][j] ? "btn-primary" : "btn-neutral"} w-20`}
				/>
			{/each}
		</div>
	{/each}
</div>
