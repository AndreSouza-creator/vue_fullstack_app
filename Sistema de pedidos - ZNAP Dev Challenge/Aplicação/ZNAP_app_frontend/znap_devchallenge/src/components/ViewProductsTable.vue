<template>
  <v-data-table density="compact" :items="proddata"></v-data-table>
</template>

<script setup>
import { defineProps } from 'vue';

// - ANDRESOUZA : Definindo a prop `udata`
defineProps({
  proddata: {
    type: Array,
    required: true,
  }
});
</script>
