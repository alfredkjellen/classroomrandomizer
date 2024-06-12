<script lang="ts">
  import { svgColor } from "$lib/controller";

  let copied = false;

  let timeout = 1500;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Show a success message or perform any other action
      copied = true;
      setTimeout(() => {
        copied = false;
      }, timeout);
    });
  }
</script>
<div class="flex justify-center mt-5">
  <div class="card bg-base-200 shadow-xl w-full max-w-xs">
    <div class="card-body">
      <h2 class="card-title">Contact</h2>
      <p>If you have any questions or have come across an issue, feel free to contact</p>
      {#if copied}
        <div
          class="tooltip tooltip-open tooltip-bottom tooltip-primary"
          data-tip="Copied!"
        >
          <button
            on:click={() => copyToClipboard("alfred.kjellen@gmail.com")}
            class="text-primary flex items-center"
          >
            alfred.kjellen@gmail.com
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white ml-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={$svgColor}
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      {:else}
        <button
          on:click={() => copyToClipboard("alfred.kjellen@gmail.com")}
          class="flex items-center hover:text-primary"
        >
          alfred.kjellen@gmail.com
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white ml-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill={$svgColor}
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>