<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav class="flex justify-center my-6">
  <ul class="steps">
    <a href="/signup" class="step step-accent">Sign up</a>
    
    <a
      href="/signup/getstarted"
      class="step"
      class:step-accent={$page.route.id?.includes("getstarted")}>
      Get Started
    </a>
  </ul>
</nav>


<!-- <main class="card w-4/6 bg-base-200 text-neutral-content mx-auto">
  <div class="card-body items-center text-center">
    <slot />
  </div>
</main> -->

<slot></slot>