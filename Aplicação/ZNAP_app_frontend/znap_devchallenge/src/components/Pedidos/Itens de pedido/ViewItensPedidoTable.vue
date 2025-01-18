<template>
  <br/>
  <v-data-table
    v-if="filteredPedidoItemData.length"
    :headers="headers"
    :items="filteredPedidoItemData"
  >
    <template v-slot:top>
      <v-row class="mb-4">
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
              @input="updatePrice"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.preco"
              label="Preço"
              type="number"
              :rules="[rules.required, rules.number]"
              :readonly="true"
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
    },
    proddata: {
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

      // Garantir que o preço seja atualizado no momento da edição
      this.updatePrice();  // Atualiza o preço imediatamente ao abrir o diálogo de edição

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

    // Atualiza o preço quando a quantidade é alterada
    updatePrice() {
      const preco = this.getDefaultPrice();
      if (preco !== undefined) {
        this.editedItem.preco = preco;
      }
    },

    // Função para pegar o preço ajustado baseado no produto
    getDefaultPrice() {
  const produtoCorrespondente = this.proddata.find(
    (prod) => prod.id_produto === this.editedItem.id_produto
  );
  if (produtoCorrespondente && produtoCorrespondente.preco && this.editedItem.qtde) {
    const precoajustado = produtoCorrespondente.preco * this.editedItem.qtde;
    console.log("O PRECO EM GETDEFAULTPRICE", precoajustado);
    return precoajustado;
  }
  return 0; // Caso não haja valor adequado
},

    async save() {
      const payload = { ...this.editedItem };

      try {
        // Enviar payload para o servidor (no backend)
        const response = await apiURL.put("/pedidos/editpedidoitem", payload);
        if (response.status === 200) {
          Object.assign(
            this.localPedidoItemData[this.editedIndex],
            this.editedItem
          );
          Swal.fire({
            customClass: {
              container: "swal-container-above"
            },
            title: "Item do pedido atualizado com sucesso."
          });
        } else {
          Swal.fire({
            customClass: {
              container: "swal-container-above"
            },
            title: "Erro ao atualizar o item do pedido."
          });
        }
      } catch (error) {
        Swal.fire({
          customClass: {
            container: "swal-container-above"
          },
          title: "Erro ao salvar o item do pedido."
        });
      }
      this.close();
    }
  }
};
</script>
