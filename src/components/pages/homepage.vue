<script setup>
import { ref } from "vue";
import { useUserStore } from "../../stores/users";

const userStore = useUserStore();

const reviews = ref([
  {
    text: "If you are reading this review, then pat yourself of the back. The search is over, bad hair days are behind you as you’ve just found yourself an amazing hairdresser. Since meeting Theresa, I have gone from a yellow-blonde frazzled, split ends disaster to asuper chic razor-sharp silver bob vision! Her attention to detail is incredible, and my hair seems to fall perfectly into place and is super glossy.",
    author: "Leigh Millar",
    role: "Founder & Creative Director",
  },
  {
    text: "I have been a client at VooDoo for over 5 years and I wouldn't trust anyone else with my hair. The team is incredibly talented, professional, and always makes you feel welcome. Whether it's a simple cut or a complete colour change, the results are always flawless. Truly the best salon in Brentwood.",
    author: "Jessica Evans",
    role: "Former client",
  },
]);

let currentIndex = ref(0);

function nextReview() {
  currentIndex.value = (currentIndex.value + 1) % reviews.value.length;
}

function prevReview() {
  currentIndex.value =
    (currentIndex.value - 1 + reviews.value.length) % reviews.value.length;
}
</script>

<template>
  <section class="Front">
    <div class="buttons">
      <router-link
        v-if="userStore.isLoggedIn.value"
        to="/booking"
        class="btn white"
        >Book Now</router-link
      >
      <router-link v-else to="/login" class="btn white">Book Now</router-link>
      <a href="#Services" class="btn peach">View Services</a>
    </div>
  </section>

  <section class="content-section">
    <h1 class="HomepageHeader">Welcome to Jenny's Hairdressing</h1>
    <p>
      Your journey to beautiful hair starts here. I work in a boutique salon in
      the heart of Brentwood, Essex, dedicated to the art of hairdressing. I am
      passionate about creating a look that is uniquely yours, using the best
      products and latest techniques.
    </p>
  </section>

  <section id="About" class="philosophy-section">
    <div class="philosophy-image">
      <img
        src="/src/assets/images/Jenny About Me.png"
        alt="Interior of the VooDoo hair salon"
      />
    </div>

    <div class="philosophy-text">
      <h2>About</h2>
      <h1 class="HomepageHeaderAbout">Me</h1>
      <p>
        At Jenny's Hairdressing, we believe that hairdressing is an art form.
        Our philosophy is rooted in understanding the individual—your style,
        your personality, and your needs. We take a holistic approach, focusing
        on both inner and outer beauty to ensure every client leaves feeling
        confident, refreshed, and truly themselves.
      </p>
    </div>
  </section>

  <section id="Services" class="Services">
    <h1 class="HomepageHeader">Services</h1>
    <ul>
      <li>Specialists in colouring</li>
      <li>Hair extensions</li>
      <li>Bouncy Blow-drys</li>
      <li>Creative cutting</li>
      <li>Hair-up</li>
      <li>Braids</li>
      <li>Bridal hair</li>
      <li>Gents barbering</li>
      <li>Deluxe treatments</li>
      <li>Smoothing treatments</li>
      <li>Free consultation</li>
      <li>Walk ins</li>
      <li>Nail technician</li>
      <li>Make-up</li>
    </ul>
  </section>

  <section class="Reviews">
    <h1 class="HomepageHeader">Hear From Happy Clients</h1>
    <h5 class="ReviewSwipe">Swipe for more</h5>

    <div class="testimonial-slider">
      <div class="slider-track-wrapper">
        <div class="testimonial-track">
          <div class="testimonial-slide">
            <transition name="slide-fade" mode="out-in">
              <div :key="currentIndex">
                <p class="review-text">{{ reviews[currentIndex].text }}</p>
                <div class="client-info">
                  <p class="client-name">
                    {{ reviews[currentIndex].author }}
                    <span class="client-title">{{
                      reviews[currentIndex].role
                    }}</span>
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <button @click="prevReview" class="slider-btn prev-btn">‹</button>
      <button @click="nextReview" class="slider-btn next-btn">›</button>
    </div>
  </section>

  <section class="Location">
    <h1 class="HomepageHeader">Find Me Here</h1>
    <div class="location-content">
      <a
        href="https://www.google.com/maps/place/Voodoo+Hair/@51.6195345,0.3005285,20.9z/data=!3m1!5s0x47d8bebdfbbfef67:0xccdc187fab8211f8!4m21!1m14!4m13!1m5!1m1!1s0x47d8bebde4bb816f:0x4a67f7fcc06e69c2!2m2!1d0.300693!2d51.619571!1m6!1m2!1s0x47d8bebde4bb816f:0x4a67f7fcc06e69c2!2s18+Crown+St,+Brentwood+CM14+4BA!2m2!1d0.300693!2d51.619571!3m5!1s0x47d8bebde4bb816f:0x4a67f7fcc06e69c2!8m2!3d51.619571!4d0.300693!16s%2Fg%2F1yh9twd17?entry=ttu&g_ep=EgoyMDI1MDgwNC4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        class="map-link"
        rel="noopener noreferrer"
      >
        <img
          src="../../assets/images/GoogleVooDoo.png"
          alt="Map showing location of VooDoo salon"
        />
      </a>

      <p class="address">18 Crown St, Brentwood CM14 4BA, United Kingdom</p>
    </div>
  </section>
</template>

<style scoped>
/*----------------- Main picture section -----------------------------*/
.Front {
  position: relative;
  background-image: url("../../assets/images/VooDoo-Background-Image.jpg");
  background-size: cover;
  background-position: center 20%;
  height: 70vh; /* keeps it proportional across devices */
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 0 5%; /* avoids content hugging edges */
}

.Front .buttons {
  padding: 0 0 2rem 0; /* bottom space, left handled by flex parent */
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/*----------------- Buttons -----------------------------*/
.btn {
  text-decoration: none;
  padding: 1rem 2rem; /* scales better than px */
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-family: "Lato", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: clamp(0.9rem, 2.5vw, 1.2rem); /* scales with screen */
}

.btn.white {
  background: var(--accent-cream);
  color: var(--primary-dark);
}

.btn.white:hover {
  background: var(--accent-gold);
  color: var(--accent-cream);
}

.btn.peach {
  background: var(--accent-gold);
  color: var(--accent-cream);
}

.btn.peach:hover {
  background: var(--accent-cream);
  color: var(--primary-dark);
}

/*----------------- Homepage Header -----------------------------*/
.HomepageHeader {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: bold;
  font-family: "Lato", sans-serif;
  color: var(--primary-dark);
  text-align: center; /* simpler centering */
  padding: 1rem; /* breathing room */
}

/*----------------- Content Section -----------------------------*/
.content-section {
  padding: clamp(2rem, 3vw, 3rem); /* scales */
  text-align: left;
  max-width: 1700px; /* prevents super wide text */
  margin: 0 auto; /* centers on large screens */
}

.content-section p {
  font-size: clamp(1rem, 2vw, 1.2rem);
  padding-left: 1rem; /* scales */
  line-height: 1.8;
  max-width: 1300px;
  color: #555;
}

/*----------------- Responsive Tweaks -----------------------------*/
@media (max-width: 768px) {
  .Front {
    height: 50vh; /* shorter hero on small screens */
    justify-content: center; /* center buttons on mobile */
    align-items: center;
    padding: 1rem;
  }

  .Front .buttons {
    padding-top: clamp(5rem, 20vw, 10rem);
    gap: 1rem;
  }

  .Front .btn {
    padding: 0.75rem 1.5rem; /* smaller padding */
    font-size: clamp(0.8rem, 3.5vw, 1rem); /* scales on phones */
  }

  .content-section {
    padding: 1.5rem;
    text-align: center; /* better readability on mobile */
  }
}

/*------------------------------------about me section --------------------------------*/
.philosophy-section {
  display: flex; /* Creates the side-by-side column layout */
  align-items: center; /* Vertically centers the content in both columns */
  background-color: var(--primary-dark);
  color: var(--accent-cream);
}

/* The two main columns (image and text) */
.philosophy-image,
.philosophy-text {
  flex: 0.5; /* Makes each column take up 50% of the width */
}

/* Style for the image in the left column */
.philosophy-image img {
  width: 70%;
  display: block; /* Removes any extra space below the image */
  padding-left: 150px;
  padding-top: 50px;
  padding-bottom: 50px;
}

/* Styling for the text in the right column */
.philosophy-text h2 {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent-gold);
  margin-bottom: 10px;
}

.philosophy-text .HomepageHeaderAbout {
  font-family: var(--font-heading);
  font-size: 36px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 25px;
}

.philosophy-text p {
  font-size: 16px;
  line-height: 1.8;
  max-width: 500px; /* Keeps the paragraph readable */
}

/* --- Responsive Design for Mobile --- */
/* On screens smaller than 900px, stack the columns */
@media (max-width: 900px) {
  .philosophy-section {
    flex-direction: column; /* Stacks the columns vertically */
  }

  .philosophy-text {
    /* Add more padding on top when stacked */
    padding-top: 80px;
    text-align: center;
  }

  .philosophy-text p {
    margin-left: auto;
    margin-right: auto;
    padding: 4%;
  }

  .philosophy-text .HomepageHeaderAbout {
    margin-left: auto;
    margin-right: auto;
  }

  .philosophy-text h2 {
    margin-left: auto;
    margin-right: auto;
  }

  /* The two main columns (image and text) */
  .philosophy-image,
  .philosophy-text {
    flex: 0.7; /* Makes each column take up 50% of the width */
  }

  /* Style for the image in the left column */
  .philosophy-image img {
    width: 90%;
    display: block;
    margin: 0 auto;
    padding-left: 0; /* reset the desktop padding */
    padding-top: 20px; /* optional: smaller spacing */
    padding-bottom: 0px;
  }
}

/* --- Services Section (Light Theme) --- */

.Services {
  /* Changed background to white */
  background-color: #fff;
  /* Changed default text color to your dark brand color */
  color: var(--primary-dark);
  padding: 80px 10%;
  text-align: left;
}

/* Services Section Header ("Services") */
.Services .HomepageHeader {
  font-family: var(--font-heading);
  font-size: 36px;
  /* Changed header color to dark */
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 20px;
  padding-bottom: 15px;

  /* The gold underline still looks great on a light background */
  display: inline-block;
  border-bottom: 2px solid var(--accent-gold);
}

/* The list container (UL) */
.Services ul {
  list-style: none;
  padding: 0;
  margin-top: 40px;
  text-align: left;
  columns: 2;
  column-gap: 50px;
}

/* Individual list items (LI) */
.Services li {
  font-size: 17px;
  padding-bottom: 20px;
  line-height: 1.5;
  /* The color is inherited from the .Services parent, so it's now dark */
}

/* Custom "bullet point" for each list item */
.Services li::before {
  content: "›";
  /* The gold accent color remains the same */
  color: var(--accent-gold);
  font-weight: bold;
  font-size: 20px;
  margin-right: 15px;
  vertical-align: middle;
}

/* --- Responsive Design for Mobile (no changes needed here) --- */
@media (max-width: 768px) {
  .Services ul {
    columns: 1;
  }

  .Services {
    padding: 60px 8%;
  }
}

/* --- Reviews / Testimonial Section --- */

.Reviews {
  background-color: var(--primary-dark);
  color: var(--accent-cream);
  padding: 80px 20px; /* Add some minimal horizontal padding */
  text-align: center;
}

.Reviews .HomepageHeader {
  color: #fff;
  border-bottom: 2px solid var(--accent-gold);
  display: inline-block;
  padding-bottom: 15px;
  margin-bottom: 40px;
}

.ReviewSwipe {
  display: none;
}

/* The slider container is now the positioning context */
.testimonial-slider {
  max-width: 800px;
  margin: 0 auto;
  /* THIS IS A KEY CHANGE: It becomes the anchor for the buttons */
  position: relative;
}

.client-info {
  display: flex;
  flex-direction: column; /* stack name & title */
  align-items: center; /* center horizontally */
  text-align: center;
}
/* A new wrapper to hide the overflow */
.slider-track-wrapper {
  overflow: hidden;
  width: 100%;
}

/* The track holds all slides in a row */
.testimonial-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

/* Individual slides */
.testimonial-slide {
  flex: 0 0 100%;
  box-sizing: border-box;
  padding: 0 10px;
}

.review-text {
  font-size: 18px;
  line-height: 1.8;
  font-style: italic;
  margin-bottom: 30px;
}

/* --- Navigation Buttons --- */

.slider-btn {
  position: absolute;
  top: 40%; /* Adjusted top position slightly */
  transform: translateY(-50%);
  background: orange;
  border: none;
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  z-index: 10;
}

/* Use negative values to push the buttons outside the slider box */
.prev-btn {
  left: -80px;
}

.next-btn {
  right: -80px;
}

/* --- Responsive Design for Mobile --- */
/* Hide the desktop arrows on small screens */
@media (max-width: 950px) {
  .slider-btn {
    position: absolute;
    top: 96%; /* Adjusted top position slightly */
    transform: translateY(-70%);
    background: orange;
    border: none;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    padding: 10px;
    z-index: 10;
  }

  .prev-btn {
    left: -15px;
  }

  .next-btn {
    right: -15px;
  }
  .testimonial-slide {
    padding: 0 20px;
  }

  .ReviewSwipe {
    color: #fff;
    border-bottom: 2px solid var(--accent-gold);
    display: flex;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
/* --- Location Section --- */
.Location {
  /* Using a light background to contrast with the dark sections */
  background-color: #fff;
  padding: 80px 20px;
  text-align: center;
}

.Location .HomepageHeader {
  color: var(--primary-dark);
  border-bottom: 2px solid var(--accent-gold);
  display: inline-block;
  padding-bottom: 15px;
  margin-bottom: 40px;
}

/* A container for the map and address */
.location-content {
  max-width: 800px;
  margin: 0 auto; /* Centers the content block */
}

/* The map image link */
.map-link {
  display: block;
  margin-bottom: 25px;
  border: 4px solid #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.map-link:hover {
  transform: scale(1.02); /* A subtle zoom effect on hover */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.map-link img {
  width: 100%;
  display: block; /* Removes any extra space below the image */
}

/* The address text */
.address {
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  margin: 0 auto;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
