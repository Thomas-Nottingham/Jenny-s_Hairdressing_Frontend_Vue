<script setup>
import { ref } from "vue";

const photos = [
  "/src/assets/images/hair4.jpg",
  "/src/assets/images/hair2.jpg",
  "/src/assets/images/hair14.webp",
  "/src/assets/images/hair8.jpg",
  "/src/assets/images/roo.jpg",
  "/src/assets/images/hair11.jpg",
  "/src/assets/images/hair15.jpg",
  "/src/assets/images/hair9.webp",
  "/src/assets/images/hair19.jpg",
];

const showLightbox = ref(false);
const currentIndex = ref(0);

const openLightbox = (index) => {
  currentIndex.value = index;
  showLightbox.value = true;
};

const closeLightbox = () => {
  showLightbox.value = false;
};

const nextPhoto = () => {
  currentIndex.value = (currentIndex.value + 1) % photos.length;
};

const prevPhoto = () => {
  currentIndex.value = (currentIndex.value - 1 + photos.length) % photos.length;
};
</script>

<template>
  <div class="gallery-page">
    <h1>Gallery</h1>
    <div class="gallery-grid">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img :src="photo" :alt="'Photo ' + (index + 1)" />
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="lightbox">
      <span class="close" @click="closeLightbox">&times;</span>
      <span class="prev" @click="prevPhoto">&#10094;</span>
      <img :src="photos[currentIndex]" class="lightbox-img" />
      <span class="next" @click="nextPhoto">&#10095;</span>
    </div>
  </div>
</template>

<style scoped>
.gallery-page {
  padding: 2rem;
  background-image: url("../../assets/images/gallery_background.webp");
  background-size: cover;
  background-position: center 20%;
  text-align: center;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 5rem; /* Big! */
  font-weight: 900; /* Very bold */
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 2rem;

  /* Vibrant gradient fill */
  background: linear-gradient(45deg, #ff6a00, #ffca00, #ff0084);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Thick outline effect */
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
    2px 2px 0 #000, 0 0 10px #eeff00, 0 0 20px #ffee00; /* glow */
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 900px; /* centers content */
}

.gallery-item img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.gallery-item img:hover {
  transform: scale(1.05);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-img {
  max-width: 80%;
  max-height: 80%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.close,
.prev,
.next {
  position: absolute;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
}

.close {
  top: 20px;
  right: 35px;
}

.prev {
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
}

.next {
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
}

.close:hover,
.prev:hover,
.next:hover {
  color: #ddd;
}

@media (max-width: 1050px) {
  h1 {
    font-size: 3rem; /* Big! */
    font-weight: 900; /* Very bold */
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 2rem;

    /* Vibrant gradient fill */
    background: linear-gradient(45deg, #ff6a00, #ffca00, #ff0084);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Thick outline effect */
    text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
      2px 2px 0 #000, 0 0 10px #eeff00, 0 0 20px #ffee00; /* glow */
  }
}
</style>
