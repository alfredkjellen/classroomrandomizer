// import { goto } from "$app/navigation";
// import { writable } from "svelte/store";
// import type { Paddle } from "@paddle/paddle-js";

// export const priceLabel = writable("");

//   let SELLER_ID = 195713;   
//   let production = false;
//   let sellerId = 0;
//   let paddleEnv: any = "";

//   if (production) {
//     sellerId = Number(SELLER_ID);
//     paddleEnv = "production";
//   } else {
//     sellerId = 20810;
//     paddleEnv = "sandbox";
//   }
  
//     // Function to initialize Paddle
//     export const initializePaddle = () => {  
//         if (window.Paddle?.Initialize) {
//         try {
//           window.Paddle.Environment.set(paddleEnv);
//           window.Paddle.Initialize({
//             token: "test_6cac96937e2d114709715ba6135",
//             checkout: {
//               settings: {
//                 displayMode: "overlay",
//                 theme: "light",
//                 locale: "en",
//                 allowedPaymentMethods: [
//                   "apple_pay",
//                   "card",
//                   "google_pay",
//                   "paypal",
//                 ],
//               },
//             },
//             eventCallback: function (event) {
//               if (event.name == "checkout.completed") {
//                 handleCheckoutCompleted();
//               }
//             },
//           });
//           console.log("Paddle initialized successfully");
//         } catch (error) {
//           console.error("Failed to initialize Paddle:", error);
//         }
//       } else {
//         console.error("Paddle.Initialize is not available");
//       }


//     // Check if Paddle is already available
//     if (window.Paddle) {
//       initializePaddle();
//     } else {
//       // If Paddle is not yet available, wait for it to load
//       window.addEventListener("paddle:loaded", initializePaddle);
//     }
//   };

//   const itemsList = [
//     {
//       priceId: "pri_01j1tps56znk8rp7a1spc35m63", // Ensure this is a valid sandbox price ID pri_01j1tps56znk8rp7a1spc35m63
//       quantity: 1,
//     },
//   ];

//   export async function startCheckout() {
//     try {
//       const transaction = await window.Paddle?.Checkout.open({
//         items: itemsList,
//       });

//       console.log("Checkout successful:", transaction);
//     } catch (error: any) {
//       console.error("Checkout error:", error);
//       // You can add more specific error handling here
//       if (error.code === "PADDLE_NETWORK_ERROR") {
//         console.error("Network error. Please check your connection.");
//       } else if (error.code === "PADDLE_INVALID_INPUT") {
//         console.error(
//           "Invalid input. Please check your price ID and other details.",
//         );
//       }
//       // Add more specific error cases as needed
//     }
//   }

//   export async function handleCheckoutCompleted() {
//     try {
//       await goto("/signup");
//       console.log("Navigation successful");
//     } catch (error) {
//       console.error("Navigation error:", error);
//     }
//   }

//   export function getPrices(billingCountry:string) {

//     var request = {
//       items: itemsList,
//       address: {
//         countryCode: billingCountry,
//       },
//     };


//     window.Paddle?.PricePreview(request).then((result:any) => {
//       result.data.details.lineItems.forEach((item:any) => {
//         priceLabel.set(item.totals.total);
//         console.log("Price Label", priceLabel);
        
//       });



//     }).catch((error:string) => {
//       console.error(error);
//     });




//   }