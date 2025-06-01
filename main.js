//hämtar router-inställningarna
import router from "./router.js";

//hämtar huvudkomponenten för appen
import App from "./app.js";

//skapar appen med huvudkomponenten App
const { createApp } = Vue;
const app = createApp(App);

//använder router för att kunna byta sida
app.use(router);

//kör appen och visa allt innehåll i elementet med id "app" i index.html
app.mount("#app");
