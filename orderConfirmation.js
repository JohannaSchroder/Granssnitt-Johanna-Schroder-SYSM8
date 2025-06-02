export default {
  name: "OrderConfirmation",
  data() {
    return {
      orderId: null, //sparar order-id
      total: null, //sparar totalbelopp
      paymentMethod: null, //sparar betalmetod
    };
  },
  created() {
    // hämtar orderdata
    this.orderId = this.$route.query.orderId;
    this.total = this.$route.query.total;
    this.paymentMethod = this.$route.query.paymentMethod;
  },
  template: `
      <div class="confirmation">
        <h1>🛸 Uppdrag mottaget! 💥</h1>
        <p>Din beställning är nu på väg.</p>
        <p><strong>Order-ID:</strong> {{ orderId }}</p>
        <p><strong>Betalning med:</strong> {{ paymentMethod }}</p>
        <p><strong>Totalt:</strong> {{ total }} kr</p>
        <p>Håll utkik i skyn!</p>
        <router-link to="/">Tillbaka till startsidan</router-link>
      </div>
    `,
};
