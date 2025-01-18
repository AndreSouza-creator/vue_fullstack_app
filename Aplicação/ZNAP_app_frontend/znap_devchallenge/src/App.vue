<template>
  <v-app>
    <div v-if="loading" class="preloader">
      <div class="preloader-image">
        <img  src="./assets/imgs/znaplogo.webp" alt="Logo" />
      </div>
      <!-- SVG de loading -->
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          stroke-width="8"
          fill="none"
          stroke-dasharray="283"
          stroke-dashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="283;0"
            dur="1s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="orange" />
            <stop offset="100%" stop-color="pink" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div v-else>
      <v-main>
        <router-view />
      </v-main>
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000); // Tempo de exibição do loader lottie.
});
</script>

<style scoped>
.preloader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff;
  overflow: hidden;
}

.preloader-image {
  width: 10%;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInOut 2s infinite;
}

.preloader-image img {
  width: 90%;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInOut 2s infinite;
}

.preloader svg {
  animation: scaleUp 1s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
</style>
