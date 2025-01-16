<template>
  <v-container class="containerAddForm">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newUser.nome"
            label="Nome"
            :rules="[rules.required]"
            required
            rounded 
            class="shrink"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="newUser.email"
            label="Email"
            dense
            :rules="[rules.required, rules.email]"
            required
            rounded
            class="shrink"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
        <v-btn :disabled="!valid" color="primary" @click="openConfirmModal">
          Adicionar Usuário
        </v-btn>
      </v-col>
      </v-row>
      
    </v-form>

    <!-- Modal de Confirmação -->
    <v-dialog v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Informações</v-card-title>
        <v-card-text>
          <p><strong>Nome:</strong> {{ newUser.nome }}</p>
          <p><strong>Email:</strong> {{ newUser.email }}</p>
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
import apiURL from "./../setups/axios.js"

console.log("apiURL",apiURL);

export default {
  data() {
    return {
      valid: false,
      confirmDialog: false,
      newUser: {
        nome: '',
        email: '',
      },
      users: [],
      nextId: 1,
      rules: {
        required: (value) => !!value || 'Este campo é obrigatório.',
        email: (value) => {
          const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
          return pattern.test(value) || 'Insira um email válido.'
        },
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
      this.users.push({ ...this.newUser });
      this.newUser.nome = '';
      this.newUser.email = '';
      this.$refs.form.reset();
      this.confirmDialog = false;

      // - ANDRESOUZA : Simulação de requisição
      this.sendDataToServer(this.users[this.users.length - 1]);
    },
    async sendDataToServer(user) {
      try {
        const response = await apiURL.post('/addcustomer', user);
        console.log(response.data);
        alert('Cliente criado com sucesso!');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>

@media(min-width: 1000px){
  .containerAddForm {
    width: 50%;
    margin-left: 0px;

    padding: 0px;
    display: flex;
    flex-direction: column;
}

}
</style>
