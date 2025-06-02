//använder Vue "reactive" så att varukorgen uppdateras automatiskt när man ändrar något
import { reactive } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

//skapar en reaktiv varukorg som man kan använda överallt i appen
export const cart = reactive({
  items: [], // Här sparas alla produkter som jag lägger i varukorgen

  //när man lägger till en produkt i varukorgen:
  addItem(product) {
    //kollar om produkten redan finns i varukorgen
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      //om den finns, ökar jag bara mängden
      existing.quantity++;
    } else {
      //om den inte finns, lägger jag till den med quantity = 1
      this.items.push({ ...product, quantity: 1 });
    }
  },

  //när man tar bort en produkt från varukorgen:
  removeItem(productId) {
    //hittar produktens plats i listan
    const index = this.items.findIndex((i) => i.id === productId);
    if (index !== -1) {
      //tar bort den från listan
      this.items.splice(index, 1);
    }
  },

  //om man vill ändra hur många av en viss produkt man har:
  updateQuantity(productId, quantity) {
    const item = this.items.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity; //sätter nytt antal
    }
  },

  //här räknas det totala priset på allt i varukorgen
  get total() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },
});
