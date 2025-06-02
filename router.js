//hämtar in två sidor: startsidan och kassan
import Home from "./Home.js";
import Checkout from "./checkout.js";
import OrderConfirmation from "./orderConfirmation.js";

//använder Vue Router för att kunna byta sida i appen
const { createRouter, createWebHashHistory } = VueRouter;

//vilka sidor som hör till vilka webbadresser
const routes = [
  { path: "/", component: Home },
  { path: "/checkout", component: Checkout },
  { path: "/order-confirmation", component: OrderConfirmation },
];

//skapar en router som håller koll på sidbyten
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//exporterar routern så den kan användas i appen
export default router;
