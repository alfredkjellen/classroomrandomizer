<script lang="ts">
  import DemoFigure from "$lib/components/DemoFigure.svelte";
  import {
    WebsiteName,
    WebsiteBaseUrl,
    WebsiteDescription,
  } from "$lib/config.ts";

  import Footer from "$lib/components/Footer.svelte";

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  };
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`;

  class Question {
    question: string;
    answer: string;
    checked: boolean;

    constructor(
      question: string,
      answer: string = "",
      checked: boolean = false,
    ) {
      this.question = question;
      this.answer = answer;
      this.checked = checked;
    }
  }

  const questions = [
    new Question(
      "Who is this for?",
      "Teachers who want to randomly assign students to seats or groups.",
    ),
    new Question(
      "Can I customize the layout for each classroom?",
      "Yes, you can!",
    ),
    new Question("How does it work?"),
    new Question("Does it cost?", "No, it's free for now!"),
  ];
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center py-12">
    <div class="max-w-xl">
      <div
        class="text-3xl md:text-5xl font-bold px-2"
        style="line-height: 1.2;"
      >
        The simplest way to randomize students
      </div>

      <div class="text-xl font-light mt-10">
        A tool for teachers to randomly assign students to seats in customized
        classrooms
      </div>

      <a href="/signup" class="mt-10 btn btn-accent btn-circle btn-wide"
        >Sign up</a
      >
    </div>
  </div>
</div>
<div class="min-h-[60vh] mt-16">
  <DemoFigure></DemoFigure>
  <div class="pt-20 pb-8 px-7">
    <div class="max-w-lg mx-auto text-center">
      <div
        class="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mt-20"
      ></div>
    </div>

    <div class="">
      <div class="font-bold">
        <div
          class="text-xl md:text-4xl gap-2 mt-40 flex justify-center items-center"
        >
          Tired of <span class="bg-error text-white rounded px-2 py-1"
            >copying</span
          > the class list
        </div>
        <div class="text-sm md:text-2xl mt-3 flex justify-center items-center">
          every time you want to randomize your students?
        </div>

        <div
          class="text-xl md:text-4xl gap-2 mt-20 flex justify-center items-center"
        >
          <span class="bg-cyan-600 text-white rounded px-2 py-1">Simplify</span
          >the process
        </div>
        <div
          class="text-sm md:text-2xl mt-3 flex justify-center items-center gap-1"
        >
          with Student Randomizer
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="mt-40">
        <div class="text-xl md:text-3xl font-bold my-5">
          Frequently asked questions
        </div>

        <div class="">
          {#each questions as question}
            <div class="collapse collapse-plus bg-base-200 mt-2">
              <input
                type="checkbox"
                name="my-accordion-3"
                checked={question.checked}
              />
              <div class="collapse-title text-xl font-medium">
                {question.question}
              </div>
              <div
                class="collapse-content flex justify-start gap-2 items-center"
              >
                <p>{question.answer}</p>
                {#if question.question === "How does it work?"}
                  <a class="btn btn-secondary btn-sm" href="/randomizeroom"
                    >Take a look!</a
                  >
                {:else if question.question === "Can I customize the layout for each classroom?"}
                  <a class="btn btn-secondary btn-sm" href="/editclassrooms"
                    >Take a look!</a
                  >
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="flex justify-center mt-20">
  <div
    class="text-xl md:text-3xl font-bold bg-clip-text px-2 text-transparent bg-gradient-to-r from-primary to-accent mb-20"
    style="line-height: 1.2;"
  >
    Student Randomizer
  </div>
</div>

<div class="mt-80">
  <Footer />
</div>
