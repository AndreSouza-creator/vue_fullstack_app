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
            <h1 class="bigTitle">📦 Gerenciar pedidos da organização</h1>
            <v-divider></v-divider>
            <br/>
            <h2>Adicionar novo pedido</h2>
            
            <AddPedidosForm v-if="udata.length" :udata="udata"/>
            <br/>
            <v-divider></v-divider>
            <br/>
            <h2>Editar e excluir pedidos</h2>
            <ViewPedidosTable v-if="pedidodata && pedidodata.length" :pedidodata="pedidodata" :udata="udata" :proddata="proddata"/>
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
  import ViewUsersTable from './Clientes/ViewUsersTable.vue';
  import ViewProductsTable from './Produtos/ViewProductsTable.vue';
  import ViewPedidosTable from './Pedidos/ViewPedidosTable.vue'; 
  import apiURL from "../setups/axios.js";
  import { onMounted } from 'vue';
import ViewItensPedidoTable from './Pedidos/Itens de pedido/ViewItensPedidoTable.vue';
import Swal from "sweetalert2";

onMounted(() => {
  this.fetchUserData();
  this.fetchProdutosData();
  this.fetchPedidosData();
});

  export default {
  components: {
    ViewUsersTable,
    ViewProductsTable,
    ViewPedidosTable,
    ViewItensPedidoTable
  },

  data() {
    return {
      tab: null, // Aba selecionada
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
        } else {
          Swal.fire("Error fetching data");
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
        } else {
          Swal.fire("Error fetching data");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchPedidosData() {
      try {
        const response = await apiURL.get('/pedidos/getpedidos');
        if (response.status === 200) {
          this.pedidodata = response.data;
        } else {
          Swal.fire("Error fetching data");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  watch: {
    // Sempre que a aba mudar, salva o valor no localStorage
    tab(newTab) {
      localStorage.setItem('selectedTab', newTab);
    },
  },

  mounted() {
    // Recupera o estado da aba ao carregar o componente
    const savedTab = localStorage.getItem('selectedTab');
    this.tab = savedTab || 'clientes'; // Define a aba padrão como 'clientes'

    // Chama as funções para buscar os dados
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