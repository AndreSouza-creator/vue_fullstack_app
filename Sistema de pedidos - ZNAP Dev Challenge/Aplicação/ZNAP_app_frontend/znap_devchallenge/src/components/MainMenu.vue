<template>
    
      <v-tabs v-model="tab">
        <v-tab value="clientes">Clientes</v-tab>
        <v-tab value="pedidos">Pedidos</v-tab>
        <v-tab value="produtos">Produtos</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="clientes">
            <h1 class="bigTitle">🤝 Gerenciar Clientes</h1>
            <p>Abaixo, as opções de gerenciamento de cliente.</p>
            <br/>
            <h2>Adicionar novo cliente</h2>
            <AddUserForm/>
            <br/>
            <h2>Editar e excluir clientes</h2>
            <ViewUsersTable v-if="udata && udata.length" :udata="udata" />
            <p v-else>Carregando dados...</p>
          </v-tabs-window-item>
          <v-tabs-window-item value="pedidos">
            <h1 class="bigTitle">📦 Gerenciar Pedidos</h1>
            <br/>
            <h2>Adicionar novo pedido</h2>
            <AddPedidosForm v-if="udata.length" :udata="udata"/>
            <br/>
            <h2>Editar e excluir pedidos</h2>
            <ViewPedidosTable v-if="pedidodata && pedidodata.length" :pedidodata="pedidodata" :udata="udata"/>
            <p v-else>Carregando dados...</p>
          </v-tabs-window-item>
          <v-tabs-window-item value="produtos">
            <h1 class="bigTitle">🛒 Gerenciar Produtos</h1>
            <br/>
            <h2>Adicionar novo produto</h2>
            <AddProductsForm/>
            <br/>
            <h2>Editar e excluir produtos</h2>
            <ViewProductsTable v-if="proddata && proddata.length" :proddata="proddata" />
            <p v-else>Carregando dados...</p>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    
  </template>
  
  <script>
  import ViewUsersTable from './ViewUsersTable.vue';
  import ViewProductsTable from './ViewProductsTable.vue';
  import ViewPedidosTable from './ViewPedidosTable.vue'; 
  import apiURL from "../setups/axios.js";
  import { ref, onMounted } from 'vue';
  
onMounted(() => {
  this.fetchUserData();
  this.fetchProdutosData();
  this.fetchPedidosData();
});

  export default {
    components: {
      ViewUsersTable,
      ViewProductsTable,
      ViewPedidosTable
    },
    
    data() {
  return {
    tab: null,
    udata: [],
    proddata: [],
    pedidodata: [],
  };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await apiURL.get('/');
          if (response.status === 200) {
            this.udata = response.data;
            console.log("FUNÇÃO GETUSERS EXECUTADA", this.udata);
          } else {
            alert("Error fetching data");
          }
        } catch (error) {
          console.log(error);
        }
      },
      async fetchProdutosData() {
        try {
          const response = await apiURL.get('/produtos/getprodutos');
          if (response.status === 200) {
            this.proddata = response.data;
            console.log("proddata", this.proddata)
          } else {
            alert("Error fetching data");
          }
        } catch (error) {
          console.log(error);
        }
      },
      async fetchPedidosData() {
        try {
          const response = await apiURL.get('/pedidos/getpedidos');
          if (response.status === 200) {
            console.log("Pedidos response!!", response);
            this.pedidodata = response.data;
            console.log("pedidodata", this.pedidodata)
          } else {
            alert("Error fetching data");
          }
        } catch (error) {
          console.log(error);
        }
      },
    },
    mounted() {
      this.fetchUserData();
      this.fetchProdutosData();
      this.fetchPedidosData();
    },
  };
  </script>
<style scoped>
     @media(min-width: 1000px){
      .bigTitle{
      font-size: 3rem;
     }
     }
     
</style>