//navigationsfältet

export default {
  template: `
    <div>
      <!-- navigationsfältet högst upp på sidan -->
      <nav class="nav-bar">
        <!-- huset navigerar till Home.js -->
        <div class="nav-side">
          <router-link to="/" class="nav-link"><!-- routerlink, byta sida men inte ladda om -->
            <!-- hus-ikon -->
            <img src="./bilder/home.png" alt="Meny" class="nav-icon" />
          </router-link>
        </div>

        <!-- hero-bild på Drone -->
        <div class="nav-logo">
          <img src="./bilder/Logga.jpeg" alt="Logga" class="nav-logo-image" />
          <p class="logo-text">Food Delivery</p>
        </div>

        <!-- kundvagnen navigerar till chekout.js -->
        <div class="nav-side">
          <router-link to="/checkout" class="nav-link">
            <!-- kundvagn-ikon -->
            <img src="./bilder/kundvagn.jpg" alt="Checkout" class="nav-icon" />
          </router-link>
        </div>
      </nav>

      <!-- visar aktuell sida, Home.js eller chekout.js -->
      <main>
        <router-view></router-view>
      </main>
    </div>
  `,
};
