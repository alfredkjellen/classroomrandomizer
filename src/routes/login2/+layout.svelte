<script lang="ts">
  import { page } from "$app/stores";
  import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
</script>

<nav class="flex justify-center my-6">
  <ul class="steps">
    <span class="step step-primary">Sign In</span>
    <span
      class="step"
      class:step-primary={$page.route.id?.match(/username|photo/g)}
    >
      Choose Username
    </span>
    <span class="step" class:step-primary={$page.route.id?.match(/photo/g)}>
      Upload Photo
    </span>
  </ul>
</nav>

<AnimatedRoute>
  <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
    <div class="card-body items-center text-center">
      <slot />
    </div>
  </main>
</AnimatedRoute>
