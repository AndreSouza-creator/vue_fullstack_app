<template>
  <v-data-table v-if="localPedidoItemData.length" :headers="headers" :items="localPedidoItemData && localPedidoItemData.length">
    <template v-slot:top>
      <v-row>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-text>
              <v-container>
                <h1>Editar Itens do Pedido</h1>
                <p>Gerencie os itens do pedido</p>
                <br />
                <v-col cols="12">
                  <v-text-field v-model="editedItem.id_pedido" label="ID Pedido" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.id_produto" label="ID Produto" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.qtde" label="Quantidade" type="number" :rules="[rules.required, rules.number]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.preco" label="Preço" type="number" :rules="[rules.required, rules.number]"></v-text-field>
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
      </v-row>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>

  <div v-else>
    <p>Nenhum item encontrado para exibição.</p>
  </div>
</template>

<script>
import apiURL from "../../../setups/axios.js";

export default {
  props: {
    localPedidoItemData: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'ID', key: 'id_pedido_item', sortable: true },
      { title: 'Pedido', key: 'id_pedido', sortable: true },
      { title: 'Produto', key: 'id_produto', sortable: true },
      { title: 'Qtd', key: 'qtde', sortable: true },
      { title: 'Preço', key: 'preco', sortable: true },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id_pedido_item: null,
      id_pedido: null,
      id_produto: null,
      qtde: null,
      preco: null
    },
    defaultItem: {
      id_pedido_item: null,
      id_pedido: null,
      id_produto: null,
      qtde: null,
      preco: null
    },
    rules: {
      required: (value) => !!value || 'Este campo é obrigatório.',
      number: (value) => !isNaN(value) || 'Insira um valor numérico válido.'
    }
  }),
  methods: {
    editItem(item) {
      this.editedIndex = this.localPedidoItemData.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.localPedidoItemData.indexOf(item);
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
        const response = await apiURL.delete(`/pedidos/deletepedidoitem/${this.editedItem.id_pedido_item}`);
        if (response.status === 200) {
          this.localPedidoItemData.splice(this.editedIndex, 1);
          this.closeDelete();
          alert("Item do pedido excluído com sucesso.");
        } else {
          alert("Erro ao excluir o item do pedido.");
        }
      } catch (error) {
        console.log("Erro na requisição de exclusão", error);
        alert("Erro ao excluir o item do pedido.");
      }
    },

    async save() {
      try {
        const payload = {
          
          id_pedido: this.editedItem.id_pedido,
          id_produto: this.editedItem.id_produto,
          qtde: this.editedItem.qtde,
          preco: this.editedItem.preco
        };

        let response;
        if (this.editedIndex > -1) {
          response = await apiURL.put("/pedidos/editpedidoitem", payload);
          if (response.status === 200) {
            Object.assign(this.localPedidoItemData[this.editedIndex], this.editedItem);
            alert("Item do pedido atualizado com sucesso.");
          } else {
            alert("Erro ao atualizar o item do pedido.");
          }
        } else {
          response = await apiURL.post('/pedidos/addpedidoitem', payload);
          if (response.status === 200) {
            this.localPedidoItemData.push(response.data);
            alert("Item do pedido adicionado com sucesso.");
          } else {
            alert("Erro ao adicionar o item do pedido.");
          }
        }

        this.close();
      } catch (error) {
        console.log("Erro na requisição de salvamento", error);
        alert("Erro ao salvar o item do pedido.");
      }
    }
  }
};
</script>
