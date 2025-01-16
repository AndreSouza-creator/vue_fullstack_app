<template>
  <v-data-table :headers="headers" :items="filteredPedidos">
    <template v-slot:top>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedClient"
            :items="udata.map(u => ({ text: u.nome, value: u.id_cliente }))"
            label="Filtrar por cliente"
            clearable
          ></v-select>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="500px">
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
                <v-select
                  v-model="editedItem.nome_cliente"
                  :items="udata.map(u => u.nome)"
                  label="Cliente atrelado ao pedido"
                ></v-select>
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

      <v-dialog v-model="dialogDelete" max-width="500px">
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
import apiURL from "../setups/axios.js";

export default {
  props: {
    pedidodata: {
      type: Array,
      required: true
    },
    udata: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Descrição', align: 'start', sortable: false, key: 'descricao' },
      { title: 'Data', key: 'data', sortable: true },
      { title: 'Id do cliente', key: 'id_cliente', sortable: false },
      { title: 'Nome do cliente', key: 'nome_cliente', sortable: false },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    selectedClient: null, // Filtro por cliente
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
    }
  }),
  computed: {
    // Filtra os pedidos com base no cliente selecionado
    filteredPedidos() {
      if (!this.selectedClient) {
        return this.pedidodata;
      }
      return this.pedidodata.filter(pedido => pedido.id_cliente === this.selectedClient);
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Pedido' : 'Editar Pedido';
    }
  },
  watch: {
    'editedItem.nome_cliente': function (newName) {
      const client = this.udata.find(client => client.nome === newName);
      this.editedItem.id_cliente = client ? client.id_cliente : null;
    }
  },
  methods: {
    // Converte data para exibição no formato DD/MM/YYYY
    formatDateToDisplay(date) {
      if (!date) return '';
      const isoDate = new Date(date);
      const day = String(isoDate.getDate()).padStart(2, '0');
      const month = String(isoDate.getMonth() + 1).padStart(2, '0');
      const year = isoDate.getFullYear();
      return `${day}/${month}/${year}`;
    },
    // Converte data para o formato YYYY-MM-DD
    formatDateToMySQL(date) {
      if (!date) return '';
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    },
    // Formata a data enquanto o usuário digita
    formatInputDate(event) {
      let value = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
      if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
      this.editedItem.data = value;
    },
    editItem(item) {
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
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    async deleteItemConfirm() {
      try {
        const response = await apiURL.delete(`/pedidos/deletepedido/${this.editedItem.id_pedido}`);
        if (response.status === 200) {
          this.pedidodata.splice(this.editedIndex, 1);
          this.closeDelete();
        } else {
          alert("Erro ao excluir o pedido.");
        }
      } catch (error) {
        console.log("Erro na requisição de exclusão", error);
      }
    },
    async save() {
      try {
        const payload = {
          descricao: this.editedItem.descricao,
          data: this.formatDateToMySQL(this.editedItem.data), // Converte a data para o formato correto
          id_pedido: this.editedItem.id_pedido,
          id_cliente: this.editedItem.id_cliente,
          nome_cliente: this.editedItem.nome_cliente
        };

        if (this.editedIndex > -1) {
          const response = await apiURL.put("/pedidos/editpedido", payload);
          if (response.status === 200) {
            Object.assign(this.pedidodata[this.editedIndex], this.editedItem);
            alert("Pedido atualizado com sucesso.");
            this.close();
          } else {
            alert("Erro ao atualizar o pedido.");
          }
        } else {
          const response = await apiURL.post('/pedidos/addpedido', payload);
          if (response.status === 200) {
            this.pedidodata.push(response.data);
            alert("Pedido adicionado com sucesso.");
            this.close();
          } else {
            alert("Erro ao adicionar o pedido.");
          }
        }
      } catch (error) {
        console.log("Erro na requisição de salvamento", error);
        alert("Erro ao salvar o pedido.");
      }
    }
  }
};
</script>
