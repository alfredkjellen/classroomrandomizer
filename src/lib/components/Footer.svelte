<!-- Spacer grows so the footer can be at bottom on short pages -->
<script>
  import { svgColor } from "$lib/controller";
</script>

<div class="flex-grow"></div>
<div class="">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer
    class="footer p-10 gap-x-48 lg:gap-x-64 xl:gap-x-96 place-content-center text-base"
  >
    <nav>
      <span class="footer-title opacity-80">Explore</span>
      <a class="link link-hover my-1" href="https://insigh.to/b/student-randomizer" target="_blank">Feedback</a>
      <a class="link link-hover my-1" href="/contact">Contact</a>
      <a class="link link-hover mb-1" href="/terms">Terms of Service</a>
      <a class="link link-hover mb-1" href="/privacy">Privacy Policy</a>
      <a class="link link-hover mb-1" href="/refund">Refund Policy</a>
      <a class="link link-hover mb-1" href="/pricing">Pricing (free for now)</a>
      
      
    </nav>
    <aside>
      <span class="footer-title opacity-80"></span>
      <p class="max-w-[260px]">
        <img
          alt="Student Randomizer Logo"
          src="/logo-5.avif"
          class="w-[50px] mb-3 h-[50px]"
        />
        <span class="font-bold">Student Randomizer</span>
        <br />
        Made by: <span class="text-primary">Alfred Kjellén</span>
        
        
      </p>
      <a href="/aboutme" class="link">About me</a>
      
      <a href="https://www.linkedin.com/in/alfred-kjellén-166a752a9" target="_blank"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={$svgColor} viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
        <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
      </svg>
      </a>

    </aside>
  </footer>
</div>
