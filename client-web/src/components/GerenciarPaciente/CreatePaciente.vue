<template>
    <div class="ui container" style="padding: 30px;">
        <h4 class="ui dividing header">{{titulo}} Paciente</h4>
        <div class="ui form" id="formulario">
            <div class="three fields">
                <div class="required field" :class="[validacao.nome ? errorClass: '']">
                    <label>Nome</label>
                    <input type="text" v-model="paciente.nome" name="nome" placeholder="Seu Nome" v-focus>
                    <div class="ui pointing red basic label" v-if="validacao.nome">
                        Insira os dados corretamente
                    </div>
                </div>
                <div class="required field" :class="[validacao.cpf ? errorClass: '']">
                    <label>CPF</label>
                    <the-mask type="text" v-model="paciente.cpf" :mask="'###.###.###-##'" placeholder="___.___.___-__" masked="true"/>
                    <div class="ui pointing red basic label" v-if="validacao.cpf">
                        Insira os dados corretamente
                    </div>
                </div>
                <div class="required field" :class="[validacao.telefone ? errorClass: '']">
                    <label>Telefone</label>
                    <the-mask type="text" v-model="paciente.telefone" :mask="['(##) ####-#####','(##) # ####-####']" placeholder="(__) _ ____-____"/>
                    <div class="ui pointing red basic label" v-if="validacao.cpf">
                        Insira os dados corretamente
                    </div>
                </div>
            </div>
            <div class="two fields">
                <div class="required field" :class="[validacao.email ? errorClass: '']">
                    <label>Email</label>
                    <input type="email" v-model="paciente.email" placeholder="email@example.com">
                    <div class="ui pointing red basic label" v-if="validacao.email">
                        Insira os dados corretamente
                    </div>
                </div>
                <div class="required field" :class="[validacao.endereco.cep ? errorClass: '']">
                    <label>CEP</label>
                    <the-mask v-model="paciente.endereco.cep" @keyup.native="buscaCep" placeholder="00000-000" :mask="'#####-###'"/>
                    <div class="ui pointing red basic label" v-if="validacao.endereco.cep">
                        Insira os dados corretamente
                    </div>
                </div>
            </div>
            <div class="three fields">
                <div class="required field">
                    <label>Logradouro</label>
                    <input type="text" v-model="paciente.endereco.logradouro" disabled>
                </div>
                <div class="required field" :class="[validacao.endereco.numero ? errorClass: '']">
                    <label>Número</label>
                    <input type="number" v-model="paciente.endereco.numero" placeholder="0" min="0">
                    <div class="ui pointing red basic label" v-if="validacao.endereco.numero">
                        Insira os dados corretamente
                    </div>
                </div>
                <div class="required field">
                    <label>Bairro</label>
                    <input type="text" v-model="paciente.endereco.bairro" disabled>
                </div>
            </div>
            <div class="two fields">
                <div class="required field">
                    <label>Cidade</label>
                    <input type="text" v-model="paciente.endereco.localidade" disabled>
                </div>
                <div class="required field">
                    <label>Estado</label>
                    <input type="text" v-model="paciente.endereco.uf" disabled>
                </div>
            </div>
        </div>
        <div class="ui grid">
            <div class="row centered">
                <div class="column">
                    <button class="circular ui red icon button" @click="cancelarPaciente">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                <div class="column">
                    <button class="circular ui blue icon button" @click="salvarPaciente">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="ui error message" v-if="erros.length > 0">
            <div class="header">Erro(s) da validação</div>
            <ul>
                <li v-for="(erro,index) in erros" :key=index>
                    {{ erro }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; 
import {TheMask} from 'vue-the-mask';


export default {

    directives: {
        focus: {
            inserted: function(el){
                el.focus();
            }
        }
    },

    components: {
        TheMask
    },

    props:{
        id: {
            type: String
        },
        paciente: {
            type: Object
        },
        titulo: {
            type: String
        }
    },

    data() {
        return {
            validacao: {
                endereco: {}
            },
            errorClass: 'error',
            erros: []
        };
    },

    methods: {
        salvarPaciente: function(){
            this.erros = []
            if(this.validarForm()){
                if(!this.id){
                    axios.post(process.env.API + "/pacientes", this.paciente)
                    .then(response => {
                        Swal.fire({
                            position: 'top-end',
                            type: 'success',
                            title: response.data.message,
                            toast: true,
                            timer: 2500,
                            showConfirmButton: false
                        })
                        this.$emit('salvarPacienteSucess', {
                            key: response.data.key
                        })
                    }).catch(error => {
                        error.response.data.message.map((item) => {
                            this.erros.push(item.label.toUpperCase() + " - " + item.message)
                        })
                    }).then(() => {
                        this.$store.commit('disableLoader')
                    })
                }else{
                    axios.put(process.env.API + `/pacientes/${this.id}`, {"paciente": this.paciente})
                    .then(response => {
                        Swal.fire({
                            position: 'top-end',
                            type: 'success',
                            title: response.data,
                            toast: true,
                            timer: 2500,
                            showConfirmButton: false
                        })
                        this.$emit('atualizarPacienteSucess')
                    }).catch(error => {
                        error.response.data.map((item) => {
                            this.erros.push(item.label.toUpperCase() + " - " + item.message)
                        })
                    }).then(() => {
                        this.$store.commit('disableLoader')
                    })
                }
            }
        },

        buscaCep: function(){
            if(this.paciente.endereco.cep.length >= 8){
                axios.get(process.env.API + `/enderecos/${this.paciente.endereco.cep}`)
                .then(response => {
                    this.paciente.endereco = response.data
                })
                .catch(error => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: error.response.data,
                        toast: true,
                        timer: 2500,
                        showConfirmButton: false
                    })
                })
                .then(() => {
                    this.$store.commit('disableLoader')
                })
            }else{
                var cep_aux = this.paciente.endereco.cep
                this.paciente.endereco = {
                    'cep': cep_aux
                }
            }
        },

        cancelarPaciente: function(){
            this.erros = []
            this.$emit('sairSemListar')
        },

        validarForm: function(){
            var retorno = true
            this.validacao = {endereco:{}}  
            if(!this.paciente.nome){
                this.$set(this.validacao, "nome", true)
                retorno = false
            }
            if(!this.paciente.cpf){
                this.$set(this.validacao, "cpf", true)
                retorno = false
            }
            if(!this.paciente.email){
                this.$set(this.validacao, "email", true)
                retorno = false
            }
            if(!this.paciente.endereco.cep){
                this.$set(this.validacao.endereco, "cep", true)
                retorno = false
            }else{
                var tamanho = this.paciente.endereco.cep.length
                if(tamanho <= 8 || tamanho > 9){
                    this.$set(this.validacao.endereco, "cep", true)
                    retorno = false
                }
            }
            if(!this.paciente.endereco.numero){
                this.$set(this.validacao.endereco, "numero", true)
                retorno = false
            }
            if(!this.paciente.telefone){
                this.$set(this.validacao, "telefone", true)
                retorno = false
            }
            return retorno
        }
    }
}
</script>

<style>

</style>