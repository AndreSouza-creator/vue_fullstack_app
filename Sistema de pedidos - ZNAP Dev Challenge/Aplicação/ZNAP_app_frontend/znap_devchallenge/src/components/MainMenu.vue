<template>
    
      <v-tabs v-model="tab">
        <v-tab value="clientes">Clientes</v-tab>
        <v-tab value="pedidos">Pedidos</v-tab>
        <v-tab value="produtos">Produtos</v-tab>
      </v-tabs>
  
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="clientes">
            <h1>👥 Gerenciar Clientes</h1>
            <p>Abaixo, as opções de gerenciamento de cliente.</p>
            <br/>
            <h1>Adicionar novo cliente</h1>
            <AddUserForm/>
            <h1>Editar e excluir clientes</h1>
            <ViewUsersTable v-if="udata && udata.length" :udata="udata" />
            <p v-else>Carregando dados...</p>
          </v-tabs-window-item>
          <v-tabs-window-item value="pedidos">
            <h1>📦 Gerenciar Pedidos</h1>
            <br/>
            <ViewPedidosTable v-if="pedidodata && pedidodata.length" :pedidodata="pedidodata" />
            <p v-else>Carregando dados...</p>
          </v-tabs-window-item>
          <v-tabs-window-item value="produtos">
            <h1>🛒 Gerenciar Produtos</h1>
            <br/>
            <h1>Adicionar novo produto</h1>
            <AddProductsForm/>
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
  
  export default {
    components: {
      ViewUsersTable,
      ViewProductsTable,
      ViewPedidosTable
    },
    data() {
      return {
        tab: null,
        udata: ref(null),
        proddata: ref(null),
        pedidodata: ref(null),
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await apiURL.get('/');
          if (response.status === 200) {
            this.udata = response.data;
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
  