<template>
  <v-app-bar  color="#333" scroll-behavior="elevate">
    <template v-slot:prepend>
   <!--  <v-app-bar-nav-icon>logo</v-app-bar-nav-icon> -->
  </template>
    <v-app-bar-title>Painel de administração</v-app-bar-title>
  </v-app-bar>
  <v-container>
    <h2>Olá, bem vindo!</h2> 
    <p>Selecione um item para administrar</p>
    <br/>
    <v-divider/>
    <br/>
    <MainMenu/>
  </v-container>
</template>

<script setup>

</script>
