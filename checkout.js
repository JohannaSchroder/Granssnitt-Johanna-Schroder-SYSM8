//importerar varukorgen från kundvagn.js
import { cart } from "./kundvagn.js";

export default {
  name: "Checkout",

  data() {
    return {
      //kundens uppgifter
      customer: {
        name: "",
        address: "",
        phone: "",
        email: "",
      },
      message: "", //meddelande till Drone
      paymentMethod: "card", //förvald betalningsmetod
      swishPhone: "", //telefonnummer om Swish används
      cardInfo: {
        //kortuppgifter
        cardNumber: "",
        expiry: "",
        cvc: "",
      },
      showModal: false, //visar bekräftelseruta
      modalMessage: "", //meddelandet i rutn
      submitting: false, //för att visa laddningsstatus för användaren, att maten skickas
    };
  },

  //här räknas vissa värden ut automatiskt
  computed: {
    cartItems() {
      return cart.items; //hämtar produkterna i varukorgen
    },
    totalPrice() {
      //räknar ut totala priset i varukorgen
      return cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },

  methods: {
    //ökar antalet av en vara
    increaseQty(item) {
      cart.updateQuantity(item.id, item.quantity + 1);
      this.refreshCart();
    },

    //minskar antalet, eller tar bort varan helt om det är 1 kvar
    decreaseQty(item) {
      if (item.quantity > 1) {
        cart.updateQuantity(item.id, item.quantity - 1);
      } else {
        this.removeItem(item);
      }
      this.refreshCart();
    },

    //tar bort en vara helt från kundvagnen
    removeItem(item) {
      cart.removeItem(item.id);
      this.refreshCart();
    },

    //tvingar Vue att uppdatera visningen
    //måste jag ha kvar denna?!
    refreshCart() {
      this.$forceUpdate();
    },

    //när man klickar på "Skicka beställning"
    async submitOrder() {
      //så användaren fyller i kort eller swish-uppgifter
      if (this.paymentMethod === "swish" && !this.swishPhone) {
        alert("Vänligen ange telefonnummer för Swish.");
        return;
      }

      if (this.paymentMethod === "card") {
        if (
          !this.cardInfo.cardNumber ||
          !this.cardInfo.expiry ||
          !this.cardInfo.cvc
        ) {
          alert("Vänligen fyll i alla kortuppgifter.");
          return;
        }
      }

      //om varukorgen är tom visas meddelande
      if (this.cartItems.length === 0) {
        alert("Din varukorg är tom!");
        return;
      }

      this.submitting = true; //visar att ordern skickas

      //skapar ett orderobjekt att skicka till servern
      const order = {
        customer: this.customer,
        message: this.message,
        paymentMethod: this.paymentMethod,
        swishPhone: this.paymentMethod === "swish" ? this.swishPhone : null,
        cardInfo: this.paymentMethod === "card" ? this.cardInfo : null,
        items: this.cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: this.totalPrice,
        date: new Date().toISOString(),
      };

      try {
        //skickar ordern till servern
        const res = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        if (!res.ok) {
          throw new Error("Något gick fel vid beställningen");
        }
        //hämtar order-ID och annan info från servern
        const responseData = await res.json();

        cart.items = [];
        this.customer = { name: "", address: "", phone: "", email: "" };
        this.message = "";
        this.paymentMethod = "card";
        this.swishPhone = "";
        this.cardInfo = { cardNumber: "", expiry: "", cvc: "" };

        // Navigera till orderbekräftelse-sidan och skicka med order-ID och total
        this.$router.push({
          path: "/order-confirmation",
          query: {
            orderId: responseData.id,
            total: order.total,
            paymentMethod: order.paymentMethod,
          },
        });
      } catch (error) {
        alert("Kunde inte skicka beställningen. Försök igen senare.");
        console.error("Fel vid beställning:", error);
      } finally {
        this.submitting = false;
      }
    },
  },

  //HTML + Vue-kod som visar allt på sidan
  template: `
    <div class="checkout-container">
      <h1>Din Beställning</h1>

      <!-- lista på produkter -->
      <ul class="cart-list" v-if="cartItems.length > 0">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <div>
            <strong>{{ item.name }}</strong> - {{ item.price }} kr
          </div>
          <div class="quantity-controls">
            <button @click="decreaseQty(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQty(item)">+</button>
          </div>
          <div>
            Totalt: {{ item.price * item.quantity }} kr
          </div>
          <button @click="removeItem(item)" class="remove-btn">Ta bort</button>
        </li>
      </ul>
      <p v-else>Drone kan inte se något i din varukorg, gå till menyn och lägg till något smarrigt</p>

      <h2 v-if="cartItems.length > 0">Total: {{ totalPrice }} kr</h2>

      <div v-if="cartItems.length > 0">
        <h2>Kundinformation</h2>
        <form @submit.prevent="submitOrder" class="customer-form">
          <label>
            Namn:
            <input v-model="customer.name" required />
          </label>
          <label>
            Adress:
            <input v-model="customer.address" required />
          </label>
          <label>
            Telefon:
            <input v-model="customer.phone" required />
          </label>
          <label>
            E-post:
            <input type="email" v-model="customer.email" required />
          </label>

          <label>
            Meddelande till Drone:
            <textarea v-model="message" placeholder="Skriv något om din beställning..."></textarea>
          </label>

          <h2>Betalningsmetod</h2>
          <label class="payment-option">
            <input type="radio" value="card" v-model="paymentMethod" />
            Kort
            <img src="bilder/Kort.jpg" alt="Kort" class="payment-icon" />
          </label>
          <label class="payment-option">
            <input type="radio" value="swish" v-model="paymentMethod" />
            Swish
            <img src="bilder/Swish.jpg" alt="Swish" class="payment-icon" />
          </label>

          <!-- kort är valt -->
          <div v-if="paymentMethod === 'card'" class="payment-info">
            <label>
              Kortnummer:
              <input type="text" v-model="cardInfo.cardNumber" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" />
            </label>
            <label>
              Giltigt till (MM/ÅÅ):
              <input type="text" v-model="cardInfo.expiry" maxlength="5" placeholder="MM/ÅÅ" />
            </label>
            <label>
              CVC:
              <input type="text" v-model="cardInfo.cvc" maxlength="3" placeholder="123" />
            </label>
          </div>

          <!-- Swish är valt -->
          <div v-if="paymentMethod === 'swish'" class="payment-info">
            <label>
              Swish telefonnummer:
              <input type="tel" v-model="swishPhone" placeholder="0701234567" />
            </label>
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? "Skickar..." : "Skicka Beställning" }}
          </button>
        </form>
      </div>

      <!-- popup-ruta med bekräftelse -->
<div v-if="showModal" class="modal-overlay" @click="closeModal">
  <div class="modal-box" @click.stop>
    <p>{{ modalMessage }}</p>
    <button type="button" @click="closeModal" class="modal-ok-btn">
      Gött! Låt maten komma!
    </button>
  </div>
</div>
    </div>
  `,
};
