<script lang="ts">
    import DemoFigure from "$lib/components/DemoFigure.svelte";
    import {themeStore} from "$lib/controller.ts";

    let messages = ["classroom dynamics", "collaboration","focus", "learning"];
    let message = "";
    let currentText = "";

    
    class Question{

        question: string;
        answer: string;
        checked: boolean;

        constructor(question:string, answer:string = "", checked:boolean = false){
            this.question = question;
            this.answer = answer;
            this.checked = checked;
        }
    }


//new Question("", ""),
    let questions = [
        new Question("Who is this for?", "Teachers who wants to randomly assign students to seats or groups"),
        new Question("Can I customize the layout for each classroom?", "Yes, you can!"),
        new Question("How does it work?"),
    ];



    async function changeText() {
        for (let i = 0; i < 2; i++) {
            await playAnimation();
            await new Promise((r) => setTimeout(r, 4000));
        }
    }

    async function playAnimation() {
        let i = 0;
        while (i < messages.length) {
            currentText = "";
            message = messages[i];
            for (let a = 0; a < message.length; a++) {
                currentText += message[a];
                await new Promise((r) => setTimeout(r, 70));
            }
            i++;

            await new Promise((r) => setTimeout(r, 2000));
        }
    }

    changeText();
</script>



<div class="ml-20">
    <h1 class="mt-40 font-bold">
        <div class="text-7xl">Randomize seating</div>
        <div class="text-4xl mt-2">
            and improve <span class=" bg-cyan-600 text-white px-2 py-1 rounded"
                >{currentText}</span
            >
        </div>
    </h1>

    <div class="my-6 font-light text-lg">
        The simple software to customize classroom layouts and randomize student
        seating
    </div>

    <div class="">

    <a href="/signup" class="btn btn-accent btn-wide btn-circle"
        >
        
        
        Sign up

        
    </a>


<div class="flex justify-center mt-20 gap-5">
<!-- 
Featured on

{#if $themeStore === "darktheme"}
<img style="width: 200px;" src="/product-hunt-logo-horizontal-orangewhite.png" alt="Product Hunt Logo">
{:else}
<img style="width: 200px;" src="/product-hunt-logo-horizontal-orange.png" alt="Product Hunt Logo">
{/if}
 -->

<div></div>


</div>



    <div class="mt-80">


<DemoFigure/>

</div>


</div>

</div>


<div class="w-screen bg-base-300 h-screen mt-96 flex justify-center">

    <div class="font-bold">



        <div class="text-5xl gap-2 mt-40">Tired of <span class=" bg-error text-white rounded px-2 py-1"
            >copying</span> the class list 

            
        </div>
        <div class="text-3xl mt-3">every time you want to randomize the seating?</div>



        <div class="text-5xl gap-2 mt-20"><span class=" bg-cyan-600 text-white rounded px-2 py-1"
            >The solution:</span> Randomize 

            
        </div>
        <div class="text-3xl mt-3">automatically with Student Randomizer</div>

    
        

    </div>
</div>








<div class="ml-20">


    <div class="mt-40">
        <div class=" text-3xl font-bold my-5">Frequently asked questions</div>


<div class="">
        {#each questions as question}


        <div class="collapse collapse-plus bg-base-200 mt-2" style="width: 40%;">
            <input type="checkbox" name="my-accordion-3" checked={question.checked} /> 
            <div class="collapse-title text-xl font-medium">
                {question.question}
            </div>
            <div class="collapse-content"> 
                <p>{question.answer}</p>
                {#if question.question === "How does it work?"}
                    <a class="btn btn-secondary btn-sm" href="/randomizeroom">Take a look!</a>

                {:else if question.question === "Can I customize the layout for each classroom?"}
                    <a class="btn btn-secondary btn-sm" href="/editclassrooms">Take a look!</a>
                    
                {/if}
            
            </div>


        </div>  

        {/each}
    </div>

       
          


    </div>


   


</div>








<footer class="footer p-10 bg-base-200 footer-center text-base-content mt-80">
    <aside>

        <img src="/logo-8.png" alt="Logo" class="w-12">
      <p>Student Randomizer<br></p>
      <p>Made by: <a href="https://github.com/alfredkjellen/studentrandomizer" class="link link-primary">Alfred Kjellén </a><br></p>
    </aside> 
   
  </footer>