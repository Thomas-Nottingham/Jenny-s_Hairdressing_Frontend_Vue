<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../stores/users"; // ✨ Import the user store

const menuOpen = ref(false);
const userStore = useUserStore(); // Initialize the store

// const admin = userStore.user.value.email === "JennyTest@123.com";
// console.log(admin);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// When the component is first created, check if the user is already logged in
onMounted(() => {
  userStore.checkAuth();
});

const handleLogout = () => {
  userStore.logout();
};
</script>
<template>
  <header class="top-bar">
    <img src="../../assets/images/JennyFav.png" alt="Salon Logo" class="logo" />

    <!-- Hamburger button -->
    <button class="hamburger" @click="toggleMenu">☰</button>

    <!-- Navigation -->
    <div class="center-nav" :class="{ open: menuOpen }">
      <ul>
        <li><router-link to="/">Homepage</router-link></li>
        <li><router-link to="/#About">About Me</router-link></li>
        <li><router-link to="/#Services">Services</router-link></li>
        <li><router-link to="/gallery">Gallery</router-link></li>
        <li>
          <a v-if="userStore.user?.value?.name === 'Admin'" href="/calendar"
            >Calendar</a
          >
        </li>
        <li>
          <router-link
            v-if="userStore.user?.value?.name === 'Admin'"
            to="/inventory"
            >Inventory</router-link
          >
        </li>
      </ul>
    </div>

    <div class="right-side">
      <router-link
        v-if="userStore.isLoggedIn.value"
        to="/booking"
        class="book-button"
        >Book Now</router-link
      >
      <router-link v-else to="/login" class="book-button">Book Now</router-link>

      <router-link
        v-if="!userStore.isLoggedIn.value"
        to="/login"
        class="login-button"
      >
        Login
      </router-link>

      <div v-else class="user-info">
        <span class="welcome-text">{{ userStore.user.value.name }}</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <footer>
    <div class="footer-content">
      <div class="footer-column about">
        <img
          src="../../assets/images/JennyFav.png"
          alt="VooDoo Salon Logo"
          class="footer-logo"
        />
        <p>Delivering the best service for you</p>
        <p>
          <strong
            >Look Spectacular – Feel Fantastic –<br />
            Find your Freedom</strong
          >
        </p>
        <div class="social-icons">
          <a href="#" class="social-icon facebook">f</a>
          <a href="#" class="social-icon instagram">in</a>
        </div>
      </div>

      <div class="footer-column links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/gallery">Gallery</a></li>
          <li><a href="#">Terms and Conditions</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </div>

      <div class="footer-column contact">
        <h4>Contact</h4>
        <p>
          <strong>Address:</strong><br />
          18 Crown St, Brentwood <br />
          CM14 4BA, United Kingdom
        </p>
        <p>
          <strong>Phone:</strong><br />
          <a href="tel:01277228777">01277 228777</a>
        </p>
        <p>
          <strong>Email:</strong><br />
          <a href="mailto:contact@jennyhairdressingsalon.com"
            >contact@jennyhairdressingsalon.com</a
          >
        </p>
      </div>

      <div class="footer-column hours">
        <h4>Opening Hours</h4>
        <ul>
          <li><span>Monday:</span> Closed</li>
          <li><span>Tuesday:</span> 10:00 - 18:00</li>
          <li><span>Wednesday:</span> 10:00 - 18:00</li>
          <li><span>Thursday:</span> 10:00 - 18:00</li>
          <li><span>Friday:</span> 10:00 - 18:00</li>
          <li><span>Saturday:</span> 10:00 - 18:00</li>
          <li><span>Sunday:</span> Closed</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 Jenny's Hairdressing | All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
/*-------------------------*Nav Bar ----------------------------*/
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Lato", sans-serif;
  font-weight: 00;
}

.top-bar ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0rem;
  padding: 0rem;
}

.top-bar ul li a {
  text-decoration: none;
  color: #222;
  font-size: 14px;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  text-transform: uppercase;
}

.top-bar ul li a:hover {
  color: #e67e22;
}

.top-bar .logo {
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
  object-fit: cover;
}

.center-nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* Login and book buttons */

.right-side {
  display: flex;
  align-items: center;
  gap: 15px;
}

.book-button {
  background: var(--primary-dark);
  color: white;
  padding: 10px 22px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
  margin-left: 20px;
}

.book-button:hover {
  background-color: #616161;
  cursor: pointer;
}

.login-button {
  text-decoration: none;
  background-color: transparent;
  border: 1px solid #111;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  color: #111;
  transition: all 0.3s ease;
}

.logout-button {
  text-decoration: none;
  background-color: transparent;
  border: 1px solid #111;
  margin-left: 0.5rem;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  color: #111;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #e67e22;
  cursor: pointer;
  border-color: #e67e22;
  color: white;
}

/*------------------------------Footer-----------------------------------*/

footer {
  background-color: #fff;
  color: var(--primary-dark);
  padding: 60px 20px 0; /* Add padding at the top, but not bottom yet */
  font-size: 15px;
}

/* Main content area with the columns */
.footer-content {
  display: flex;
  flex-wrap: wrap; /* Allows columns to stack on smaller screens */
  justify-content: space-between;
  gap: 40px; /* Space between columns */
  max-width: 1200px;
  margin: 0 auto;
}

.footer-column {
  flex: 1; /* Allows columns to grow */
  min-width: 220px; /* Minimum width before stacking */
}

.footer-column.about {
  margin-top: -40px; /* Adjust this value up or down as needed */
}

/* Styling for the headings in the footer */
.footer-column h4 {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 16px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  display: inline-block;
}

/* Styling for lists (Quick Links, Opening Hours) */
.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 12px;
}

/* Make links in the footer look clean */
.footer-column a {
  color: var(--primary-dark);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: var(--accent-gold);
}

/* Specific styles for the 'About' column */
.footer-logo {
  max-height: 7rem;
}
.about p {
  margin-bottom: 20px;
  line-height: 1.6;
}
.footer-cta {
  display: inline-block;
  margin-bottom: 20px;
}

/* Social media icons styling */
.social-icons a {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
  margin-right: 5px;
  font-weight: bold;
  text-transform: lowercase;
}
.social-icon.facebook {
  background-color: #3b5998;
}
.social-icon.instagram {
  background-color: #e4405f;
}

/* Styling for the opening hours list */
.hours li {
  display: flex;
  justify-content: space-between;
}
.hours li span {
  font-weight: bold;
  margin-right: 10px;
}

/* The final copyright bar at the bottom */
.footer-bottom {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
  padding: 20px 0px;
  margin-top: 40px;
  border-top: 1px solid #eee;
  font-size: 13px;
  color: #777;
}

/* Hide hamburger on desktop */
.hamburger {
  display: none;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}

@media (max-width: 1050px) {
  .hamburger {
    display: block;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
  }

  .top-bar {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    position: relative;
    z-index: 1100;
  }

  .center-nav {
    display: none;
    width: 100%;
    background: white;
    position: absolute;
    top: 70px; /* below header */
    left: 0;
    padding: 1rem 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  .center-nav.open {
    display: block;
  }

  .center-nav ul {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .right-side {
    order: 2;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .top-bar .logo {
    order: 1;
    margin-bottom: 10px;
  }

  .top-bar ul {
    flex-direction: column;
    gap: 10px;
  }

  .footer-bottom {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
    padding: 20px 0px;
    margin-top: 40px;
    border-top: 1px solid #eee;
    font-size: 13px;
    color: #777;
  }
}
</style>
