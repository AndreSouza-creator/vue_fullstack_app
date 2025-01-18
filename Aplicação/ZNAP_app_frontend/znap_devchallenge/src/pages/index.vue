<template>
  <v-app-bar id="navbar" scroll-behavior="elevate">
    <template v-slot:prepend>
    <v-app-bar-nav-icon>
      <img id="navlogo" src="../assets/imgs/znaplogo.webp">
    </v-app-bar-nav-icon>
  </template>

  </v-app-bar>
  <v-container>
    <h2>Painel de administração ZNAP</h2>
    <h1>Olá, bem vindo!</h1> 
    <p>Selecione um item para administrar</p>
    <br/>
    <v-divider/>
    <br/>
    <MainMenu/>
  </v-container>
</template>

<script setup>

</script>

<style lang="css" scoped>
     #navbar{
      background-color: rgb(30, 31, 31);
      color: white;
      height: 60px;
      display: flex;
      
     }

     #navlogo{
      width: 82px;
      padding: 0px;
      margin-left: 100%;
     }

     #navbartitle{
       margin-left: 50%;
     }

    .v-row {
    flex-basis: 0;
    flex-grow: 1;
    min-width: 100%;
    padding: 0px;
}  


</style>
