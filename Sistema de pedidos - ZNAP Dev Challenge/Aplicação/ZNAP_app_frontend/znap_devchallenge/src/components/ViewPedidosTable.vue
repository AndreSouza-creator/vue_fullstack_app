<template>
  <v-data-table density="compact" :items="pedidodata"></v-data-table>
</template>

<script setup>
import { defineProps } from 'vue';

// - ANDRESOUZA : Definindo a prop `udata`
defineProps({
  pedidodata: {
    type: Array,
    required: true,
  }
});
</script>
