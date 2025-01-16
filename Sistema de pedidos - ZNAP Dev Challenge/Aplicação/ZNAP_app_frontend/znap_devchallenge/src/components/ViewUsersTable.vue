<template>
  <v-data-table
    :headers="headers"
    :items="udata">
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field v-model="editedItem.id_cliente" label="ID Cliente"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Tem certeza que deseja deletar o item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
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
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import apiURL from "../setups/axios.js";

export default {
  props: {
    udata: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Nome', align: 'start', sortable: false, key: 'nome' },
      { title: 'Email', key: 'email' },
      { title: 'ID Cliente', key: 'id_cliente' },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      nome: '',
      email: '',
      id_cliente: 0
    },
    defaultItem: {
      nome: '',
      email: '',
      id_cliente: 0
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item';
    }
  },

  watch: {
    dialog (val) {
      val || this.close();
    },
    dialogDelete (val) {
      val || this.closeDelete();
    }
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.udata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
      this.editedIndex = this.udata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    // Alterado para enviar a requisição de DELETE
    async deleteItemConfirm () {
  try {
    // Usando o método DELETE para a requisição
    const response = await apiURL.delete(`/deletecustomer/${this.editedItem.id_cliente}`);
    
    if (response.status === 200) {
      // Se a exclusão for bem-sucedida, remove o item localmente
      this.udata.splice(this.editedIndex, 1);
      this.closeDelete();
    } else {
      alert("Erro ao excluir o cliente.");
    }
  } catch (error) {
    console.log("Erro na requisição de exclusão", error);
    alert("Erro ao excluir o cliente.");
  }
},

    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete () {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    close () {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async editItemConfirm () {
  try {
    // Usando o método DELETE para a requisição
    const response = await apiURL.post(`/editcustomer/${this.editedItem.id_cliente}`);
    
    if (response.status === 200) {
      // Se a exclusão for bem-sucedida, remove o item localmente
      this.udata.splice(this.editedIndex, 1);
      this.closeEdit();
    } else {
      alert("Erro ao excluir o cliente.");
    }
  } catch (error) {
    console.log("Erro na requisição de exclusão", error);
    alert("Erro ao excluir o cliente.");
  }
},

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.udata[this.editedIndex], this.editedItem);
      } else {
        this.udata.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
