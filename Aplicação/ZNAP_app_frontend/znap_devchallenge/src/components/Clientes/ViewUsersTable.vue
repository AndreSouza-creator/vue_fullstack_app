<template>
  <v-data-table :headers="headers" :items="udata">
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-text>
            <v-container>
              <h1>Editar cliente</h1>
              <v-col cols="12">
                <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
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

      <v-dialog v-model="dialogDelete" max-width="600px">
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
import apiURL from "../../setups/axios.js";
import Swal from "sweetalert2";

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
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  mounted() {
    console.log("componente montou")
  },

  methods: {

    editItem(item) {
      this.editedIndex = this.udata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.udata.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await apiURL.delete(`/deletecustomer/${this.editedItem.id_cliente}`);
        if (response.status === 200) {
          this.udata.splice(this.editedIndex, 1);
          this.closeDelete();
    
          Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada
            },
            title: 'Cliente excluído com sucesso.'
        });
        } else {

          Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada
            },
            title: "Erro ao excluir o cliente."
        });
        }
      } catch (error) {
        console.error("Erro na requisição de exclusão", error);
        Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada
            },
            title: "Erro ao excluir o cliente."
        });
      }
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
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        const endpoint = this.editedIndex > -1 ? '/editcustomer' : '/addcustomer';
        const payload = {
          nome: this.editedItem.nome,
          email: this.editedItem.email,
          id_cliente: this.editedItem.id_cliente
        };

        const response = this.editedIndex > -1 ?
          await apiURL.put(`${endpoint}/${this.editedItem.id_cliente}`, payload) :
          await apiURL.post(endpoint, payload);

        if (response.status === 200) {
          if (this.editedIndex > -1) {
            Object.assign(this.udata[this.editedIndex], response.data); // Atualiza o item editado
            Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Usuário atualizado com sucesso."
          });
          } else {
            this.udata.push(response.data); // Adiciona novo item
           
            Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Usuário adicionado com sucesso."
          });
          }
          this.close();
        } else {
          Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Erro ao salvar o cliente."
          });
        }
      } catch (error) {
        console.error("Erro na requisição de salvamento", error);
        Swal.fire({
          customClass: {
          container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Erro ao salvar o cliente."
          });
      }
    }
  }
};
</script>
<style scoped>
.swal-container-above{
  z-index: 99999 !important;
}
</style>