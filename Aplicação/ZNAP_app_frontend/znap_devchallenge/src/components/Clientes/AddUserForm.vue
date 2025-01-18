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
          <v-btn :disabled="!valid" rounded color="secondary" @click="openConfirmModal">
            Adicionar Usuário
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- Modal de Confirmação -->
    <v-dialog v-model="confirmDialog" max-width="600px">
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
import apiURL from "../../setups/axios.js";
import Swal from "sweetalert2";

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
      rules: {
        required: (value) => !!value || 'Este campo é obrigatório.',
        email: (value) => {
          const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
          return pattern.test(value) || 'Insira um email válido.';
        },
      },
    };
  },
  mounted() {
    this.fetchUsers(); // Carregar os usuários existentes
  },
  methods: {
    openConfirmModal() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    async saveUser() {
      try {
        // Envia os dados do novo usuário para o servidor
        const response = await apiURL.post('/addcustomer', this.newUser);

        if (response.status === 200) {
          // Se a criação for bem-sucedida, mostre o alerta
          Swal.fire({
            customClass: {
              container: 'swal-container-above',
            },
            title: 'Cliente criado com sucesso!',
          });

          // Limpa os campos do formulário
          this.newUser.nome = '';
          this.newUser.email = '';
          this.$refs.form.reset();
          this.confirmDialog = false;

          // Atualiza a lista de usuários no frontend diretamente
          // Aqui, suponha que a resposta contenha os dados do novo usuário
          this.users.push(response.data);

          // Recarregue os usuários, se necessário
          // this.fetchUsers(); // Caso precise recarregar a lista
        } else {
          console.error("Erro na resposta do servidor", response);
        }
      } catch (error) {
        console.error("Erro ao salvar usuário", error);
      }
    },
    async fetchUsers() {
      try {
        // Carregar a lista de usuários do servidor
        const response = await apiURL.get('/getcustomers');
        this.users = response.data;
      } catch (error) {
        console.error("Erro ao carregar os usuários", error);
      }
    },
  },
};
</script>

<style scoped>
.swal-container-above {
  z-index: 99999 !important;
}

@media(min-width: 1000px) {
  .containerAddForm {
    width: 50%;
    margin-left: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
  }
}
</style>
