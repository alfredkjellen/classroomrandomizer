<script lang="ts">
    let levelColors = ["accent", "primary", "secondary", "warning", "error"];
    let isChecked = Array(levelColors.length).fill(false);

    class Area {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }

    class Category {
        name: string;
        areas: Area[];
        constructor(name: string, areas: Area[] = []) {
            this.name = name;
            this.areas = areas;
        }

        addArea(area: Area) {
            this.areas.push(area);
        }
    }

    class Level {
        level: number;
        categories: Category[];
        constructor(level: number, categories: Category[] = []) {
            this.level = level;
            this.categories = categories;
        }

        addCategory(category: Category) {
            this.categories.push(category);
        }
    }

    // Level 1





    $: selectedLevels = isChecked.reduce((acc, curr, index) => {
        if (curr) acc.push(index);
        return acc;
    }, []);

    const clickedButton = (id: number) => {
        isChecked = isChecked.map((_, index) => index === id);

        updateCategoriesAndAreas(id);
    };

    let selectedMenuOption: any = null;
    let selectedAreaOption: any = null;

    const menuOptions = [
        { name: "Geometri", areas: ["Vinklar", "Cirklar", "Polygoner"] },
        { name: "Algebra", areas: ["Ekvationer", "Funktioner", "Olikheter"] },
        { name: "Kalkyl", areas: ["Derivator", "Integraler", "Gränsvärden"] },
    ];

    let currentAreas: any = [];

    const selectMenuOption = (option: string) => {
        selectedMenuOption = option;
        currentAreas = menuOptions.find((o) => o.name === option)?.areas || [];
        selectedAreaOption = null; // Nollställ valt område när ny kategori väljs
    };

    const selectAreaOption = (area: string) => {
        selectedAreaOption = area;
    };

    const updateCategoriesAndAreas = (levelId: number) => {};
</script>

<div class="flex mx-auto pt-4 justify-between w-full">
    <div class="flex items-start gap-4">
        <div>
            {#each levelColors as color, i}
                <div>
                    <button
                        class="btn mb-2 btn-{color} {isChecked[i]
                            ? ''
                            : 'btn-outline'}"
                        on:click={() => clickedButton(i)}
                        >Level {i + 1}
                    </button>
                </div>
            {/each}
        </div>

        <div class="menu bg-base-200 w-56 p-2 rounded-box">
            <ul class="menu-list">
                {#each menuOptions as option}
                    <li>
                        <a
                            class="justify-between {selectedMenuOption ===
                            option.name
                                ? 'active'
                                : ''}"
                            href="/problems"
                            on:click={() => selectMenuOption(option.name)}
                        >
                            {option.name}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>

        <div
            class="menu bg-base-200 w-56 p-2 rounded-box"
            hidden={!selectedMenuOption}
        >
            <ul class="menu-list">
                {#each currentAreas as area}
                    <li>
                        <a
                            class="justify-between {selectedAreaOption === area
                                ? 'active'
                                : ''}"
                            href="/probelms"
                            on:click={() => selectAreaOption(area)}
                        >
                            {area}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

    <div class="flex items-start">
        <input
            type="text"
            placeholder="Search"
            class="input input-bordered input-primary w-full max pr-4"
        />
    </div>
</div>
