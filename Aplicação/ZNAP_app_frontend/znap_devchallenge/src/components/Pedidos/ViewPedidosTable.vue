<template>
  <v-data-table :headers="headers" :items="filteredPedidos">
    <template v-slot:top>
      <v-row>
        <v-col cols="12" md="4">
          <br />
          <v-select v-model="selectedClient" :items="udata.map(u => ({ nome: u.nome, valor: u.id_cliente }))"
            label="Filtrar por cliente" item-title="nome" item-value="valor" clearable rounded
            variant="outlined"></v-select>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-text>
            <v-container>
              <h1>Editar Pedido</h1>
              <p>Adicione novas características ao pedido</p>
              <br />
              <v-col cols="12">
                <v-text-field v-model="editedItem.descricao" label="Descrição"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.data" label="Data" @input="formatInputDate"
                  :rules="[rules.required, rules.data]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.nome_cliente" :items="udata.map(u => u.nome)"
                  label="Cliente atrelado ao pedido"></v-select>
              </v-col>
              <v-col cols="12">
                <h2>Itens do pedido</h2>
                <br />
                <v-divider></v-divider>
                <br />
                <AddItensPedidosForm :pedidodata="pedidodata" :udata="udata" :proddata="proddata"
                  :editedItem="editedItem"></AddItensPedidosForm>
                <ViewItensPedidoTable :pedidodata="pedidodata" :udata="udata" :proddata="produtos"
                  :localPedidoItemData="localPedidoItemData" />
              </v-col>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-card-title class="text-h5">Tem certeza que deseja deletar o item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import apiURL from "../../setups/axios.js";
import Swal from "sweetalert2";

export default {
  props: {
    pedidodata: {
      type: Array,
      required: true
    },
    udata: {
      type: Array,
      required: true
    },
    proddata: {
      type: Array,
      required: true
    },
    pedidoItemData: {
      type: Array
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Nome do cliente', key: 'nome_cliente', sortable: false },
      { title: 'Descrição', align: 'start', sortable: false, key: 'descricao' },
      { title: 'Data', key: 'data', sortable: true },
      { title: 'Id do cliente', key: 'id_cliente', sortable: false },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    selectedClient: null, // Filtro por cliente
    selectedProduct: null, // Filtro por produto
    editedIndex: -1,
    editedItem: {
      descricao: '',
      data: '',
      id_pedido: 0,
      id_cliente: null
    },
    defaultItem: {
      descricao: '',
      data: '',
      id_pedido: 0,
      id_cliente: null
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      data: (value) => {
        const formattedDate = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1/$2/$3');
        const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
        return pattern.test(formattedDate) || 'Insira uma data válida no formato DD/MM/YYYY.';
      }
    },
    localPedidoItemData: [] // Cópia local da prop pedidoItemData
  }),
  computed: {
    filteredPedidos() {
      return this.pedidodata.filter(pedido => {
        const matchesClient = !this.selectedClient || pedido.id_cliente === this.selectedClient;

        const matchesProduct = !this.selectedProduct ||
          this.localPedidoItemData.some(item =>
            item.id_pedido === pedido.id_pedido && item.id_produto === this.selectedProduct
          );

        return matchesClient && matchesProduct;
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Pedido' : 'Editar Pedido';
    }
  },
  watch: {
    pedidoItemData(newVal) {
      this.localPedidoItemData = [...newVal];
    },
    'editedItem.nome_cliente': function (newName) {
      const client = this.udata.find(client => client.nome === newName);
      this.editedItem.id_cliente = client ? client.id_cliente : null;
    }
  },
  methods: {
    formatDateToDisplay(date) {
      if (!date) return '';
      const isoDate = new Date(date);
      const day = String(isoDate.getDate()).padStart(2, '0');
      const month = String(isoDate.getMonth() + 1).padStart(2, '0');
      const year = isoDate.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatDateToMySQL(date) {
      if (!date) return '';
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    },
    formatInputDate(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
      if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
      this.editedItem.data = value;
    },
    editItem(item) {
      this.fetchPedidoItens(item.id_pedido);
      this.editedIndex = this.pedidodata.indexOf(item);
      this.editedItem = {
        ...item,
        data: this.formatDateToDisplay(item.data) // Exibe no formato DD/MM/YYYY
      };
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.pedidodata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await apiURL.delete(`/pedidos/deletepedido/${this.editedItem.id_pedido}`);
        if (response.status === 200) {
          this.pedidodata.splice(this.editedIndex, 1);
          this.closeDelete();
        } else {
          Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Erro ao excluir o pedido."
          });
        }
      } catch (error) {
        console.error("Erro na requisição de exclusão", error);
      }
    },
    async fetchPedidoItens(idPedido) {
      try {
        const response = await apiURL.get(`/pedidos/getpedidoitens/${idPedido}`);
        if (response.status === 200) {
          this.localPedidoItemData = response.data;
          this.$emit('update:pedidoItemData', this.localPedidoItemData);
        }
      } catch (error) {
        console.error("Erro ao buscar os itens do pedido:", error);
      }
    },
    async save() {
      try {
        // Validação dos campos obrigatórios
        if (!this.editedItem.descricao || !this.editedItem.data || !this.editedItem.id_cliente) {
          Swal.fire({
          customClass: {
          icon: 'error',
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title:  "Preencha todos os campos obrigatórios."
          });
          return;
        }

        // Converte a data para o formato MySQL
        const formattedDate = this.formatDateToMySQL(this.editedItem.data);

        // Define o payload com os dados do pedido
        const payload = {
          descricao: this.editedItem.descricao,
          data: formattedDate,
          id_cliente: this.editedItem.id_cliente,
          nome_cliente: this.editedItem.nome_cliente,
          id_pedido: this.editedItem.id_pedido,
        };

        // Atualizar pedido existente
        const response = await apiURL.put('/pedidos/editpedido/', payload);
        if (response.status === 200) {
    if (response.data?.message?.includes("sucesso")) {
        // Atualiza o pedido na tabela
        Object.assign(this.pedidodata[this.editedIndex], {
            ...payload,
            nome_cliente: this.udata.find(u => u.id_cliente === this.editedItem.id_cliente)?.nome || ''
        });
        Swal.fire({
          customClass: {
          icon: 'success',
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title:  "Pedido atualizado com sucesso."
          });
    } else {
      Swal.fire({
      customClass: {
      icon: 'success',
      container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
        },
        title:  "Pedido atualizado com sucesso."
      });
        console.log("Atenção", "Pedido atualizado, mas mensagem inesperada da API.", "info");
    }
    } else {
        Swal.fire({
          customClass: {
          icon: 'error',
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title:  "Erro inesperado ao atualizar o pedido."
          });
    }

       this.close();
      } catch (error) {
        console.error("Erro ao salvar o pedido:", error);
      }

    }
  }
};
</script>
<style lang="css" scoped>
.swal-container-above{
  z-index: 99999 !important;
}

</style>
