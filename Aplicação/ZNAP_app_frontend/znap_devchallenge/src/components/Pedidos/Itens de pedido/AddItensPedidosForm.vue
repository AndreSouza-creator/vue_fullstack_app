<template>
  <v-container class="containerAddForm">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <p>Adicionar novo item ao pedido</p>
        <v-col>
          <v-select
            v-model="newItemPedido.nome_produto"
            :items="proddata.map((prd) => prd.nome)"
            item-value="id_produto"
            item-text="nome_produto"
            label="Produto"
            dense
            :rules="[rules.required]"
            required
            rounded
            class="shrink"
            variant="outlined"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="newItemPedido.qtde"
            label="Quantidade"
            dense
            :rules="[rules.required, rules.qtde]"
            required
            rounded
            class="shrink"
            variant="outlined"
            type="number"
          ></v-text-field>
        </v-col>

         Valor Total:
        <v-col>{{ `R$ `+ totalValue}}
          <!-- <v-text-field
            :value="`R$ `+ totalValue"
            dense
            variant="outlined"
          ></v-text-field> -->
        </v-col>
        <br/>
      </v-row>

      <v-btn :disabled="!valid" color="secondary" @click="openConfirmModal">
        Adicionar Item ao Pedido
      </v-btn>
      <br />
<!--       <pre>{{ newItemPedido }}</pre> -->
    </v-form>
    <br />
    <!-- Modal de Confirmação -->
    <v-dialog v-model="confirmDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Confirmar Informações</v-card-title>
        <v-card-text>
          <p><strong>Produto:</strong> {{ newItemPedido.nome_produto }}</p>
          <p><strong>Quantidade:</strong> {{ newItemPedido.qtde }}</p>
          <p><strong>Valor Total:</strong> {{ totalValue }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveItemPedido">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>



<script>
import apiURL from "../../../setups/axios.js";
import Swal from "sweetalert2";

export default {
  props: {
    proddata: {
      type: Array,
      required: true
    },
    editedItem: {},
  },
  data() {
    return {
      valid: false,
      confirmDialog: false,
      newItemPedido: {
        id_pedido: this.editedItem.id_pedido,
        id_produto: null,
        nome_produto: null,
        qtde: null,
        preco: null, // Adicionando o campo preco
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        qtde: (value) => value > 0 || "Quantidade deve ser maior que 0."
      }
    };
  },
  watch: {
    "newItemPedido.nome_produto"(novoNomeProduto) {
      const produto = this.proddata.find((prod) => prod.nome === novoNomeProduto);
      if (produto) {
        this.newItemPedido.id_produto = produto.id_produto;
      } else {
        this.newItemPedido.id_produto = null; // Caso não encontre correspondência
      }
      // Recalcular o preço caso o produto mude
      this.newItemPedido.preco = this.totalValue;
    },
    "newItemPedido.qtde"(qtde) {
      // Recalcular o preço sempre que a quantidade mudar
      this.newItemPedido.preco = this.totalValue;
    }
  },
  computed: {
    totalValue() {
      return this.calculateTotalValue();
    }
  },
  methods: {
    calculateTotalValue() {
      const produto = this.proddata.find((prod) => prod.id_produto === this.newItemPedido.id_produto);
      if (produto && this.newItemPedido.qtde) {
        return produto.preco * this.newItemPedido.qtde; // Calcular valor total
      }
      return 0; // Se não houver produto ou quantidade, o valor será 0
    },
    openConfirmModal() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    saveItemPedido() {
  if (this.$refs.form.validate()) {
    // Enviar dados para o endpoint
    apiURL
      .post("/pedidos/addpedidoitem", {
        id_pedido: this.newItemPedido.id_pedido,
        id_produto: this.newItemPedido.id_produto,
        qtde: this.newItemPedido.qtde,
        preco: this.newItemPedido.preco, // Enviar o valor total calculado
      })
      .then(() => {
        Swal.fire("Item adicionado ao pedido com sucesso!");

        // Resetar formulário após sucesso
        this.newItemPedido = {
          id_pedido: null,
          id_produto: null,
          nome_produto: null,
          qtde: null,
          preco: null,
        };
        this.$refs.form.reset();
        this.confirmDialog = false;
      })
      .catch((error) => {
        console.error("Erro ao adicionar item ao pedido:", error);
        Swal.fire("Erro ao adicionar item ao pedido. Por favor, tente novamente.");
      });
  }
},

    // Função para pegar nome do produto por id (caso precise)
    getProductName(id_produto) {
      const produto = this.proddata.find((prod) => prod.id_produto === id_produto);
      return produto ? produto.nome_produto : "Produto não encontrado";
    }
  }
};
</script>




<style lang="css" scoped>
.v-row {
  flex-direction: column;
}
</style>
