//importerar varukorgen från kundvagn.js
import { cart } from "./kundvagn.js";

export default {
  data() {
    return {
      menuCategories: [], //här sparas alla kategorier från menyn
      selectedCategory: null, //håller reda på vilken kategori som är vald (null = alla)
      addedItems: {},
    };
  },

  // Körs automatiskt när komponenten skapas
  async created() {
    try {
      //hämtar menydata från servern db.json
      const res = await fetch("http://localhost:3000/menu");

      //felmeddelande vid fel
      if (!res.ok) {
        throw new Error("Något gick fel med hämtningen av menyn");
      }

      //läser in datan som kommer från servern
      const data = await res.json();

      //menykategorierna hämtas och sparas
      this.menuCategories = data.categories;
    } catch (error) {
      //felmeddelande vid fel vid hämtning
      console.error("Fel vid hämtning av menyn:", error);
    }
  },

  //värden, uppdateras automatiskt vid förändringar
  computed: {
    filteredCategories() {
      //visar alla om ingen kategori är vald
      if (!this.selectedCategory) return this.menuCategories;

      //annars visas bara vald kategori
      return this.menuCategories.filter(
        (cat) => cat.name.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    },
  },

  //funktioner som körs vid klick och liknande
  methods: {
    //välj en kategori
    selectCategory(name) {
      this.selectedCategory = name;
    },

    //lägg till en vara i kundvagnen
    addToCart(item) {
      cart.addItem(item);

      this.addedItems[item.id] = true;

      setTimeout(() => {
        delete this.addedItems[item.id];
      }, 1000);
    },
  },

  //HTML-koden som visas i webbläsaren
  template: `
  <div class="home-container">

    <!-- knappar för att välja kategori -->
    <nav class="category-nav">
      <button
        v-for="category in menuCategories"
        :key="category.name"
        @click="selectCategory(category.name)"
        :class="{ active: selectedCategory === category.name }"
      >
        {{ category.name }}
      </button>

      <!-- knapp för att visa alla -->
      <button
        @click="selectCategory(null)"
        :class="{ active: selectedCategory === null }"
      >
        Alla
      </button>
    </nav>

    <!-- visar produkter i valda kategorier -->
    <section
      class="menu-section"
      v-for="(category, index) in filteredCategories"
      :key="index"
    >
      <h2>{{ category.name }}</h2>
      <ul class="menu-list">
        <li v-for="item in category.items" :key="item.id" class="menu-item">
          <!-- produktbild -->
          <img :src="item.image" :alt="item.name" class="menu-image" />

          <!-- info om produkten -->
          <div class="menu-text">
            <h3 class="menu-name">{{ item.name }}</h3>
            <p class="description">{{ item.description }}</p>
          </div>

          <!-- pris + knapp för att lägga till -->
          <p class="price">{{ item.price }} kr</p>
          <button
  :data-id="item.id"
  @click="addToCart(item)"
  :class="{ added: addedItems[item.id] }"
>
  {{ addedItems[item.id] ? "💥 Tillagd i varukorgen" : "Lägg till i varukorg" }}
</button>
        </li>
      </ul>
    </section>

  </div>
`,
};
