export const defaultPlanId = "free"

export const pricingPlans = [
  // {
  //   id: "free",
  //   name: "Free",
  //   description: "A free plan to get you started!",
  //   price: "$0",
  //   priceIntervalName: "per month",
  //   stripe_price_id: null,
  //   features: ["MIT Licence", "Fast Performance", "Stripe Integration"],
  // },
  {
    id: "pro",
    name: "Pro",
    description:
      "The perfect plan for your school.",
    price: "$0",
    priceIntervalName: "/ year",
    stripe_price_id: "price_1NkdZCHMjzZ8mGZnRSjUm4yA",
    stripe_product_id: "prod_OXj1CcemGMWOlU",
    features: [
      "Customize layout for each classroom",
      "Add class lists",
      "Randomize students in classrooms and groups",
    ],
  },
  // {
  //   id: "enterprise",
  //   name: "Enterprise",
  //   description:
  //     "A plan to test the upgrade expereince. Try buying this with the test credit card 4242424242424242.",
  //   price: "$15",
  //   priceIntervalName: "per month",
  //   stripe_price_id: "price_1Nkda2HMjzZ8mGZn4sKvbDAV",
  //   stripe_product_id: "prod_OXj20YNpHYOXi7",
  //   features: [
  //     "Everything in Pro",
  //     "Try the 'upgrade plan' UX",
  //     "Still actually free!",
  //   ],
  // },
]
