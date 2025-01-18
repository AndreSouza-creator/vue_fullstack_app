<template>
  <br/>
  <v-data-table
    v-if="filteredPedidoItemData.length"
    :headers="headers"
    :items="filteredPedidoItemData"
  >
    <template v-slot:top>
      <v-row class="mb-4">
        <!-- Filtro por Produto -->
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedProduct"
            :items="productOptions"
            label="Filtrar por Produto"
            clearable
            @change="() => console.log('selectedProduct changed:', selectedProduct)"
          ></v-select>
        </v-col>
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

  <!-- Dialog para editar itens -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-text>
        <v-container>
          <h1>Editar Itens do Pedido</h1>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.id_pedido"
              label="ID Pedido"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.id_produto"
              label="ID Produto"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.qtde"
              label="Quantidade"
              type="number"
              :rules="[rules.required, rules.number]"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.preco"
              label="Preço"
              type="number"
              :rules="[rules.required, rules.number]"
            ></v-text-field>
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

  <!-- Dialog para deletar itens -->
  <v-dialog v-model="dialogDelete" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">
        Tem certeza que deseja deletar o item?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
          OK
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import apiURL from "../../../setups/axios.js";
import Swal from "sweetalert2";

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
      { title: "ID", key: "id_pedido_item", sortable: true },
      { title: "Produto", key: "nome_produto", sortable: true },
      { title: "Qtd", key: "qtde", sortable: true },
      { title: "Preço", key: "preco", sortable: true },
      { title: "Ações", key: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id_pedido_item: null,
      id_pedido: null,
      id_produto: null,
      nome_produto: null,
      qtde: null,
      preco: null
    },
    defaultItem: {
      id_pedido_item: null,
      id_pedido: null,
      id_produto: null,
      nome_produto: null,
      qtde: null,
      preco: null
    },
    selectedProduct: null, // Produto selecionado no filtro
    productOptions: [], // Lista de opções de produtos para o filtro
    rules: {
      required: (value) => !!value || "Este campo é obrigatório.",
      number: (value) => !isNaN(value) || "Insira um valor numérico válido."
    }
  }),
  computed: {
    filteredPedidoItemData() {
      console.log("selectedProduct:", this.selectedProduct);
      console.log("localPedidoItemData:", this.localPedidoItemData);
      if (!this.selectedProduct && this.selectedProduct !== 0) {
        return this.localPedidoItemData; // Exibe todos os itens se não houver filtro
      }
      return this.localPedidoItemData.filter((item) => {
        console.log("Comparando item.nome_produto:", item.nome_produto, "com selectedProduct:", this.selectedProduct);
        return item.nome_produto && item.nome_produto.toLowerCase().includes(this.selectedProduct.toLowerCase());
      });
    }
  },
  mounted() {
    // Opções de produtos únicas com base nos itens disponíveis
    this.productOptions = Array.from(
      new Set(this.localPedidoItemData.map((item) => item.nome_produto))
    );
    console.log("productOptions:", this.productOptions);
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.localPedidoItemData.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.localPedidoItemData.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
    },

    async deleteItemConfirm() {
      try {
        const response = await apiURL.delete(
          `/pedidos/deletepedidoitem/${this.editedItem.id_pedido_item}`
        );
        if (response.status === 200) {
          this.localPedidoItemData.splice(this.editedIndex, 1);
          this.closeDelete();
          Swal.fire({
            customClass: {
              container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Item do pedido excluído com sucesso."
          });
        } else {
          Swal.fire({
            customClass: {
              container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
            },
            title: "Erro ao excluir o item do pedido."
          });
        }
      } catch (error) {
        console.error("Erro na requisição de exclusão", error);
        Swal.fire({
          customClass: {
            container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
          },
          title: "Erro ao excluir o item do pedido."
        });
      }
    },

    async save() {
      try {
        const payload = { ...this.editedItem };

        let response;
        if (this.editedIndex > -1) {
          response = await apiURL.put("/pedidos/editpedidoitem", payload);
          if (response.status === 200) {
            Object.assign(
              this.localPedidoItemData[this.editedIndex],
              this.editedItem
            );
            Swal.fire({
              customClass: {
                container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
              },
              title: "Item do pedido atualizado com sucesso."
            });
          } else {
            Swal.fire({
              customClass: {
                container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
              },
              title: "Erro ao atualizar o item do pedido."
            });
          }
        } else {
          response = await apiURL.post("/pedidos/addpedidoitem", payload);
          if (response.status === 200) {
            this.localPedidoItemData.push(response.data);
            Swal.fire({
              customClass: {
                container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
              },
              title: "Item do pedido adicionado com sucesso."
            });
          } else {
            Swal.fire({
              customClass: {
                container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
              },
              title: "Erro ao adicionar o item do pedido."
            });
          }
        }

        this.close();
      } catch (error) {
        Swal.fire({
          customClass: {
            container: 'swal-container-above' // Adicionando uma classe personalizada para o z-index
          },
          title: "Erro ao salvar o item do pedido."
        });
      }
    }
  }
};
</script>