<template>
  <v-container class="mt-5">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newUser.nome"
            label="Nome"
            :rules="[rules.required]"
            required
            class="custom-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newUser.preco"
            label="Preco"
            :rules="[rules.required, rules.preco]"
            required
            class="custom-input"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn :disabled="!valid" color="primary" @click="openConfirmModal">
        Adicionar Usuário
      </v-btn>
    </v-form>

    <!-- Modal de Confirmação -->
    <v-dialog v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Informações</v-card-title>
        <v-card-text>
          <p><strong>Nome:</strong> {{ newUser.nome }}</p>
          <p><strong>Preco:</strong> {{ newUser.preco }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveUser">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import apiURL from "../setups/axios.js"

console.log("apiURL",apiURL);

export default {
  data() {
    return {
      valid: false,
      confirmDialog: false,
      newUser: {
        nome: '',
        preco: '',
      },
      products: [],
      nextId: 1,
      rules: {
        required: (value) => !!value || 'Este campo é obrigatório.',
        preco: (value) => {
          // Substitui a vírgula por ponto
          const convertedValue = value.replace(',', '.');

          // Verifica se o valor é um número válido
          const pattern = /^(\d+(\.\d{1,2})?)$/;

          if (pattern.test(convertedValue)) {
            return true;
          } else {
            return 'Insira um preço válido.';
          }
        }

      },
    };
  },
  methods: {
    openConfirmModal() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    saveUser() {
      this.products.push({ ...this.newUser });
      this.newUser.nome = '';
      this.newUser.preco = '';
      this.$refs.form.reset();
      this.confirmDialog = false;

      // - ANDRESOUZA : Simulação de requisição
      this.sendDataToServer(this.products[this.products.length - 1]);
    },
    async sendDataToServer(product) {
      try {
        const response = await apiURL.post('/produtos/addproduct', product);
        console.log(response.data);
        alert('Cliente criado com sucesso!');
        fetchUserData();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 90%;
  margin: auto;
}

.custom-input {
  width: 100%;
}
</style>
