<template>
  <v-data-table
    :headers="headers"
    :items="proddata">
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-container>
                 <h1>Editar Produto</h1>
                 <p>Adicione novas características ao produto</p>
                 <br/>
                <v-col cols="12" >
                  <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                </v-col>
                <v-col cols="12" >
                  <v-text-field v-model="editedItem.preco" label="Preco"></v-text-field>
                </v-col>
              
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
    proddata: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Nome', align: 'start', sortable: false, key: 'nome' },
      { title: 'Preco', key: 'preco' },  
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      nome: '',
      preco: '',
      id_produto: 0
    },
    defaultItem: {
      nome: '',
      preco: '',
      id_produto: 0
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
      this.editedIndex = this.proddata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
      this.editedIndex = this.proddata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
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

    async deleteItemConfirm () {
      try {
        const response = await apiURL.delete(`/produtos/deleteproduct/${this.editedItem.id_produto}`);
        if (response.status === 200) {
          this.proddata.splice(this.editedIndex, 1);
          this.closeDelete();
        } else {
          alert("Erro ao excluir o produto.");
        }
      } catch (error) {
        console.log("Erro na requisição de exclusão", error);
      }
    },

    

    async save() {
      try {
        const endpoint = "/produtos/editproduct";
        const payload = {
          nome: this.editedItem.nome,
          preco: this.editedItem.preco,
          id_produto: this.editedItem.id_produto
        };

        console.log("Payload going", payload)

        if (this.editedIndex > -1) {
          // Atualizando um cliente existente
          const response = await apiURL.put(endpoint, payload);
          if (response.status === 200) {
            Object.assign(this.proddata[this.editedIndex], this.editedItem);
            alert("Produto atualizado com sucesso.");
            console.log("PRODATA", this.proddata);
            this.close();
          } else {
            alert("Erro ao atualizar o produto.");
          }
        } else {
          // Adicionando um novo produto
          const response = await apiURL.post('/produtos/addproduto', payload);
          if (response.status === 200) {
            this.proddata.push(response.data);
            alert("Produto adicionado com sucesso.");
            this.close();
          } else {
            alert("Erro ao adicionar o produto.");
          }
        }
      } catch (error) {
        console.log("Erro na requisição de salvamento", error);
        alert("Erro ao salvar o produto.");
      }
    }
  }
};
</script>
