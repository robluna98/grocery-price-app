// const hebURL = "https://www.instacart.com/store/h-e-b/collections";
// const costcoURL = "https://www.instacart.com/store/costco/collections";

// const hebLinks = [
// Produce
// `${hebURL}/fresh-fruits`,
// `${hebURL}/fresh-vegetables`,
// `${hebURL}/herbs`,
// // Dairy & Eggs
// `${hebURL}/milk`,
// `${hebURL}/cheese`,
// `${hebURL}/eggs`,
// `${hebURL}/yogurt`,
// `${hebURL}/butter`,
// `${hebURL}/plant-based-milks`,
// `${hebURL}/1780-half-half`,
// `${hebURL}/1781-cottage-cheese`,
// `${hebURL}/sour-cream-cream-cheese-cottage-cheese`,
// `${hebURL}/creams`,
// `${hebURL}/coffee-creamers`,
// // // Beverages
// `${hebURL}/soda-soft-drinks`,
// `${hebURL}/sports-drinks`,
// `${hebURL}/coffee`,
// `${hebURL}/water-sparkling-water`,
// `${hebURL}/energy-drinks`,
// `${hebURL}/juice`,
// `${hebURL}/870-milk`,
// `${hebURL}/kombucha`,
// `${hebURL}/1194-mixers-non-alcoholic-drinks`,
// `${hebURL}/tea`,
// `${hebURL}/drink-mixes`,
// `${hebURL}/990-protein-shakes`,
// // Meat & Seafood
// `${hebURL}/603-chicken`,
// `${hebURL}/beef`,
// `${hebURL}/pork`,
// `${hebURL}/604-turkey`,
// `${hebURL}/fish`,
// `${hebURL}/shellfish`,
// `${hebURL}/hot-dogs-sausages`,
// `${hebURL}/668-meat-alternatives`,
// `${hebURL}/968-lamb`,
// `${hebURL}/game-meats`,
// // Snacks & Candy
// `${hebURL}/chocolate-candy`,
// `${hebURL}/chips`,
// `${hebURL}/9797-crackers`,
// `${hebURL}/9805-pudding-gelatin`,
// `${hebURL}/9798-cookies-sweet-treats`,
// `${hebURL}/snack-bars`,
// `${hebURL}/9795-nuts-trail-mix`,
// `${hebURL}/9796-dried-fruit-fruit-snacks`,
// `${hebURL}/popcorn`,
// `${hebURL}/9804-fruit-cups-applesauce`,
// `${hebURL}/gum-and-mints`,
// `${hebURL}/dips`,
// `${hebURL}/jerky`,
// `${hebURL}/873-more-snacks`,
// // Frozen
// `${hebURL}/pizza-meals`,
// `${hebURL}/ice-cream`,
// `${hebURL}/apps-snacks`,
// `${hebURL}/frozen-fruits`,
// `${hebURL}/vegetables`,
// `${hebURL}/frozen-breakfast`,
// `${hebURL}/meat-seafood`,
// `${hebURL}/desserts`,
// `${hebURL}/breads-doughs`,
// `${hebURL}/broths-juice`,
// // Bakery
// `${hebURL}/bread`,
// `${hebURL}/buns-rolls`,
// `${hebURL}/cookies-brownies`,
// `${hebURL}/bagels-english-muffins`,
// `${hebURL}/cakes-pies`,
// `${hebURL}/breakfast-pastries`,
// `${hebURL}/specialty-desserts`,
// `${hebURL}/tortillas-flatbreads`,
// `${hebURL}/frozen-baked-goods`,
// // Deli
// `${hebURL}/3090-deli-meats`,
// `${hebURL}/3091-cheese`,
// `${hebURL}/3092-olives-dips-spreads`,
// `${hebURL}/3093-tofu-meat-alternatives`,
// // Prepared Foods
// `${hebURL}/3096-sandwiches-wraps`,
// `${hebURL}/3097-pizza-meals`,
// `${hebURL}/3098-sushi`,
// `${hebURL}/3099-party-platters`,
// `${hebURL}/3100-soups`,
// `${hebURL}/3101-salads`,
// `${hebURL}/3102-chicken`,
// `${hebURL}/3103-other-prepared-meats`,
// `${hebURL}/3104-snack-packs`,
// `${hebURL}/3105-meal-kits`,
// // Dry Goods & Pasta
// `${hebURL}/rices-grains`,
// `${hebURL}/pasta`,
// `${hebURL}/962-boxed-meals`,
// `${hebURL}/noodles`,
// `${hebURL}/canned-tomato`,
// `${hebURL}/pastas-pizza-sauces`,
// `${hebURL}/dried-beans`,
// `${hebURL}/seeds`,
// `${hebURL}/2190-more-dry-goods`,
// // Condiments & Sauces
// `${hebURL}/ketchup`,
// `${hebURL}/mustard`,
// `${hebURL}/mayo`,
// `${hebURL}/salad-dressing`,
// `${hebURL}/relish`,
// `${hebURL}/871-pasta-sauces`,
// `${hebURL}/hot-sauce`,
// `${hebURL}/asian-sauces`,
// `${hebURL}/salsa`,
// `${hebURL}/salad-toppings`,
// `${hebURL}/olives-pickles`,
// `${hebURL}/pastes`,
// `${hebURL}/horseradish-wasabi`,
// `${hebURL}/other-sauces`,
// // Canned Goods & Soups
// `${hebURL}/canned-tomatoes`,
// `${hebURL}/canned-coconut`,
// `${hebURL}/soups`,
// `${hebURL}/canned-beans`,
// `${hebURL}/canned-meat`,
// `${hebURL}/canned-fish`,
// `${hebURL}/canned-meals`,
// `${hebURL}/canned-fruits`,
// `${hebURL}/broths-and-stocks`,
// `${hebURL}/canned-vegetables`,
// // Breakfast
// `${hebURL}/nut-butters`,
// `${hebURL}/breakfast-bars`,
// `${hebURL}/oatmeal`,
// `${hebURL}/pancake-waffle`,
// `${hebURL}/granola`,
// `${hebURL}/maple-syrup`,
// `${hebURL}/fruit-preserves`,
// `${hebURL}/toaster-pastries`,
// `${hebURL}/634-cereal`,
// // Household
// `${hebURL}/paper-goods`,
// `${hebURL}/cleaning-solutions`,
// `${hebURL}/laundry`,
// `${hebURL}/foil-plastic`,
// `${hebURL}/trash-bins-bags`,
// `${hebURL}/candles-air-fresheners`,
// `${hebURL}/cleaning-tools`,
// `${hebURL}/housewares`,
// `${hebURL}/589-pest-control`,
// // Baking Essentials
// `${hebURL}/baking-mixes`,
// `${hebURL}/cake-decoratings`,
// `${hebURL}/baking-milks`,
// `${hebURL}/baking-chocolates-morsels`,
// `${hebURL}/flours`,
// `${hebURL}/honey-syrup-sweetners`,
// `${hebURL}/baking-powders`,
// `${hebURL}/pie-crusts`,
// `${hebURL}/extracts`,
// `${hebURL}/sugars`,
// `${hebURL}/ice-cream-cones`,
// `${hebURL}/refrigerated-doughs`,
// `${hebURL}/marshmallows`,
// // Oils, Vinegars & Spices
// `${hebURL}/spices`,
// `${hebURL}/bread-crumbs`,
// `${hebURL}/boullions`,
// `${hebURL}/salt-pepper`,
// `${hebURL}/cooking-oils`,
// `${hebURL}/vinegar`,
// `${hebURL}/marinades`,
// // Health Care
// `${hebURL}/cold-flu-allergy`,
// `${hebURL}/vitamins-supplements`,
// `${hebURL}/digestive-stomach`,
// `${hebURL}/first-aid`,
// `${hebURL}/health-care-supplies`,
// `${hebURL}/childrens-health`,
// `${hebURL}/protein-performance-weight`,
// `${hebURL}/muscle-joint`,
// `${hebURL}/foot-care`,
// `${hebURL}/specialty-treatments`,
// // Personal Care
// `${hebURL}/lotion-soap`,
// `${hebURL}/oral-hygiene`,
// `${hebURL}/shave-needs`,
// `${hebURL}/deodorants`,
// `${hebURL}/feminine-care`,
// `${hebURL}/facial-care`,
// `${hebURL}/ear-eye-care`,
// `${hebURL}/hair-care`,
// `${hebURL}/adult-care`,
// `${hebURL}/sexual-wellness`,
// `${hebURL}/sun-care`,
// `${hebURL}/3470-cosmetics`,
// // Kitchen Supplies
// `${hebURL}/kitchen-utensils`,
// `${hebURL}/cookware-bakeware`,
// `${hebURL}/knives-silverware`,
// `${hebURL}/towels-mitts`,
// `${hebURL}/glasses-mugs`,
// `${hebURL}/food-storage`,
// `${hebURL}/plates-bowls`,
// `${hebURL}/gadgets-appliances`,
// `${hebURL}/disposable-tabletop`,
// `${hebURL}/kitchen-organization`,
// `${hebURL}/water-bottles`,
// // Baby
// `${hebURL}/baby-health-care`,
// `${hebURL}/bath-potty`,
// `${hebURL}/toys`,
// `${hebURL}/diapering`,
// `${hebURL}/bottles-forumla`,
// `${hebURL}/baby-food-drinks`,
// `${hebURL}/breast-feeding`,
// // Pets
// `${hebURL}/874-dogs`,
// `${hebURL}/875-cats`,
// `${hebURL}/876-fish`,
// `${hebURL}/878-small-pets`,
// `${hebURL}/877-birds`,
// `${hebURL}/879-more-pet-supplies`,
// // Miscellaneous
// `${hebURL}/858-apparel`,
// `${hebURL}/859-home-garden`,
// `${hebURL}/862-sports-outdoor`,
// `${hebURL}/861-electronics`,
// `${hebURL}/860-auto`,
// `${hebURL}/11735-bags`,
// // Office & Craft
// `${hebURL}/office-supplies`,
// `${hebURL}/pens-pencils`,
// `${hebURL}/notebooks-paper`,
// `${hebURL}/office-organization`,
// `${hebURL}/other-office`,
// `${hebURL}/art-crafts`,
// `${hebURL}/office-electronics`,
// `${hebURL}/kids-arts-crafts`,
// ];

// const costcoLinks = [
//   `${costcoURL}/fresh-fruits`,
//   `${costcoURL}/fresh-vegetables`,
// ];

// console.log(hebLinks);
// console.log(costcoLinks);

// module.exports = {
//   hebLinks,
//   // costcoLinks,
// };

const stores = {
  HEB: {
    url: "https://www.instacart.com/store/h-e-b/collections",
    categories: {
      Produce: ["fresh-fruits", "fresh-vegetables", "herbs"],
      "Dairy & Eggs": ["milk"],
      Beverages: ["soda-soft-drinks"],
      // Add more categories as needed
    },
  },
  Costco: {
    url: "https://www.instacart.com/store/costco/collections",
    categories: {
      Produce: ["fresh-fruits"],
      // Costco categories
    },
  },
  // Add more stores as needed
};

const allLinks = Object.values(stores).flatMap(({ url, categories }) =>
  Object.values(categories).flatMap((subpaths) =>
    subpaths.map((subpath) => `${url}/${subpath}`)
  )
);

module.exports = {
  allLinks,
  stores,
};
