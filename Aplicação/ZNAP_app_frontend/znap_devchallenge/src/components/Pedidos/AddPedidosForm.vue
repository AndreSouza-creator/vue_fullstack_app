<template>
  <v-container class="containerAddForm">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col>
          <v-text-field v-model="newDemand.data" label="Data" dense :rules="[rules.required, rules.data]"
            @input="formatData" required rounded class="shrink" variant="outlined"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="newDemand.descricao" label="Descricao" dense :rules="[rules.required, rules.descricao]"
            required rounded class="shrink" variant="outlined"></v-text-field>
        </v-col>
        <v-col>
          <v-select 
            v-model="newDemand.nome_cliente" 
            :items="udata.map((ud) => ud.nome)"
            label="Selecione o Cliente atrelado a esse pedido"
            rounded
            variant="outlined">
          </v-select>
        </v-col>
        <v-col>
        </v-col>
      </v-row>

      <v-btn :disabled="!valid" rounded color="secondary" @click="openConfirmModal">
        Adicionar Pedido
      </v-btn>
    </v-form>
    <!-- Modal de Confirmação -->
    <v-dialog v-model="confirmDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Confirmar Informações</v-card-title>
        <v-card-text>
          <p><strong>Data:</strong> {{ newDemand.data }}</p>
          <p><strong>Descricao:</strong> {{ newDemand.descricao }}</p>
          <p><strong>Cliente:</strong> {{ newDemand.nome_cliente }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveDemand">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
  data() {
    return {
      valid: false,
      confirmDialog: false,
      newDemand: {
        data: '',
        descricao: '',
        nome_cliente: ''
      },
      products: [],
      rules: {
        required: (value) => !!value || 'Este campo é obrigatório.',
        data: (value) => {
          const formattedDate = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1/$2/$3');
          const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
          if (pattern.test(formattedDate)) {
            return true;
          } else {
            return 'Insira uma data válida no formato DD/MM/YYYY.';
          }
        }
      }
    };
  },
  watch: {
  'newDemand.nome_cliente': function (newName) {
    const client = this.udata.find(client => client.nome === newName);
    this.newDemand.id_cliente = client ? client.id_cliente : null;
  }
},
  methods: {
    someMethod() {
    console.log("V-MODEL",this.newDemand.id_cliente); // Acessando o valor do v-model aqui
     },
    openConfirmModal() {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true;
      }
    },
    saveDemand() {
      this.products.push({ ...this.newDemand });
      this.newDemand = { id_pedido: '', data: '', descricao: '', id_cliente: null, nome_cliente: '', id_pedido: '' };
      this.$refs.form.reset();
      this.confirmDialog = false;
      this.sendDataToServer(this.products[this.products.length - 1]);
    },
    formatDateToMySQL(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Retorna no formato YYYY-MM-DD
  },



  //REQUISICAO
 async sendDataToServer(pedido) {
    console.log("O PAYLOAD",pedido);
    try {
      const formattedDate = this.formatDateToMySQL(pedido.data); // Formata a data
      const response = await apiURL.post('/pedidos/addpedido', {
        id_cliente: pedido.id_cliente,
        data: formattedDate,
        descricao: pedido.descricao,
        nome_cliente: pedido.nome_cliente
      });
      console.log("OPAYLOAD",pedido);
      Swal.fire('Pedido criado com sucesso!');
    } catch (error) {
      console.error(error.response.data);
    }
  },

    formatData(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length <= 2) {
        value = value.replace(/(\d{2})/, '$1');
      } else if (value.length <= 4) {
        value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
      } else if (value.length <= 8) {
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
      }
      this.newDemand.data = value;
      event.target.value = value;
    },

  getClientIdByName() {
    const client = this.udata.find(client => client.nome === this.newDemand.nome_cliente);
    console.log("CLIENTBYNAME", client);
    return client ? client.id_cliente : null; // Retorna o id_cliente ou null caso não encontre
    
  }

  }
};
</script>
<style lang="css" scoped>
.v-row{
  flex-direction: column;
}


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