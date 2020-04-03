<template>
    <div @keyup.esc="sairSemListar">
        <div class="ui grid">
            <div class="row">
                <div class="column aligned">
                    <table class="ui celled table" id="dados">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Ações</th>  
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(paciente, key) in pacientes" :key=key class="center aligned">
                                <td>{{ paciente.nome }}</td>
                                <td>{{ paciente.cpf }}</td>
                                <td>{{ paciente.email }}</td>
                                <td>{{ paciente.telefone }}</td>
                                <td>
                                    <div class="ui buttons">
                                        <button class="ui teal icon button" @click="editarPaciente(paciente, key)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="ui icon red button" @click="deletarPaciente(key, paciente.nome)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                <th colspan="5">
                                    <div class="ui right floated small primary circular icon button" @click="novoPaciente">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        <modal name="createPaciente" height="auto" width="800" :draggable=true :clickToClose=false> 
            <CreatePaciente
                :paciente=paciente 
                :titulo=titulo 
                :id=key
                @salvarPacienteSucess="salvarPacienteSucess"
                @atualizarPacienteSucess="atualizarPacienteSucess"
                @resetPaciente="resetPaciente"
                @sairSemListar="sairSemListar">
            </CreatePaciente>
            <div class="ui error message" v-if="erro">
                <div class="header">Algumas campos não foram validados corretamente</div>
                <p>Teste</p>
            </div>
        </modal>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import CreatePaciente from './CreatePaciente.vue';
import axios from 'axios';

export default {
    name: 'ViewPaciente',

    components: {
        CreatePaciente,
    },

    data(){
        return {
            key: null,
            paciente: {},
            pacientes: [],
            titulo: '',
            erro: false,
        };
    },

    created() {
        this.listagemPaciente();
    },

    beforeUpdate(){
        $("#dados").DataTable().destroy();
    },
   
    updated(){
        $("#dados").DataTable({
            language: pt_br,
        });
    },

    methods: {
        listagemPaciente: function(){
            axios.get(process.env.API  + "/pacientes")
                .then(response => {
                    this.pacientes = response.data
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
        },

        novoPaciente: function(){
            this.paciente = {
                endereco: {
                    'cep': ''
                }
            }
            this.key = null
            this.titulo = 'Cadastrar'
            this.$modal.show('createPaciente')
        },

        editarPaciente: function(paciente, key){
            this.paciente = paciente
            this.key = key
            this.titulo = 'Editar'
            this.$modal.show('createPaciente')
        },

        deletarPaciente: function(key, nome){
            Swal.fire({
                title: 'Deletar paciente?',
                text: `O paciente '${nome}' será removido`,
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2185d0',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!',
                cancelButtonText: 'Não, cancelar',
            }).then((result) => {
                if(result.value){
                    axios.delete(process.env.API  + `/pacientes/${key}`)
                    .then(response => {
                        Swal.fire({
                            position: 'top-end',
                            type: 'success',
                            title: response.data,
                            toast: true,
                            timer: 2500,
                            showConfirmButton: false
                        })
                        this.$delete(this.pacientes, key)
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
                }
            })
            
        }, 

        salvarPacienteSucess: function(payload) {
            this.$modal.hide('createPaciente')
            this.$set(this.pacientes, payload.key, this.paciente)
        },

        atualizarPacienteSucess: function(){
            this.$modal.hide('createPaciente')
        },

        resetPaciente: function(){
            this.$modal.hide('createPaciente')
            this.listagemPaciente();
        },

        sairSemListar: function(){
            if(this.titulo == 'Editar'){
                this.resetPaciente();
            }else{
                this.$modal.hide('createPaciente')
            }
        }

    }
}
</script>

<style>

</style>