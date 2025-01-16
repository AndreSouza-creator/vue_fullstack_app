<template>
  <v-data-table
    :headers="headers"
    :items="pedidodata">
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-container>
              <h1>Editar Pedido</h1>
              <p>Adicione novas características ao pedido</p>
              <br/>
              <v-col cols="12">
                <v-text-field v-model="editedItem.descricao" label="Descrição"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.data" label="Data"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select 
                v-model="editedItem.nome_cliente" 
                :items="udata.map((u) => u.nome)" 
                item-value="id_cliente" 
                item-text="nome" 
                label="Cliente atrelado ao pedido">
              </v-select>


                <pre>{{ editedItem }}</pre>
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

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Resetar</v-btn>
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
      { title: 'Data', key: 'data' },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
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
    }
  }),
  watch: {
  'editedItem.nome_cliente': function (newName) {
    const client = this.udata.find(client => client.nome === newName);
    this.editedItem.id_cliente = client ? client.id_cliente : null;
  }
   },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Pedido' : 'Editar Pedido';
    }
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.pedidodata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    formatDateToMySQL(date) {
  const isoDate = new Date(date);
  const year = isoDate.getFullYear();
  const month = String(isoDate.getMonth() + 1).padStart(2, '0');
  const day = String(isoDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Retorna no formato YYYY-MM-DD
   },


   async save() {
  try {
    const payload = {
      descricao: this.editedItem.descricao,
      data: this.formatDateToMySQL(this.editedItem.data), // Converte a data
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
