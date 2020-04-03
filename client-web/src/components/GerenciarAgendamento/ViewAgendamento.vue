<template>
    <div>
        <div class="ui grid">
            <div class="row">
                <div class="column aligned">
                    <table class="ui celled table" id="dados">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Data e Horario</th>
                                <th>Motivo</th>
                                <th>Aprovação</th>  
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(agendamento, key) in agendamentos" :key=key class="center aligned">
                                <td>{{ agendamento.paciente.nome }}</td>
                                <td class="cpf">{{ agendamento.paciente.cpf }}</td>
                                <td>{{ agendamento.data }} {{agendamento.horario}}</td>
                                <td>
                                    <textarea cols="30" rows="2" style="border: 0px;" readonly v-model="agendamento.motivo"></textarea>
                                </td>
                                <td>
                                    <div class="ui buttons" v-if="agendamento.situacao == 'pendente'"> 
                                        <button class="ui green icon button" @click="aprovarAgendamento(key, true)">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="ui icon red button" @click="aprovarAgendamento(key, false)">
                                            <i class="fas fa-times"></i>
                                        </button> 
                                    </div>
                                    <div style="text-transform: capitalize" v-else>{{ agendamento.situacao }}</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                <th colspan="5">
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios'

export default {
    name: 'ViewAgendamento',

    data(){
        return {
            key: null,
            agendamento: {},
            agendamentos: [],
        };
    },

    sockets: {
        consulta: function(data) {
            this.$set(this.agendamentos, data.key, data.consulta)
        }
    },

    created(){
        this.listagemAgendamento();
    },

    updated() {
        $("#dados").DataTable({
            language: pt_br,
        });
        $(".cpf").mask('000.000.000-00')
    },
    
    beforeUpdate(){
        $("#dados").DataTable().destroy();
    },

    methods: {
        listagemAgendamento: function(){
            axios.get(process.env.API  + "/agendamentos")
            .then(response => {
                this.agendamentos = response.data
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
            .then(()=>{
                this.$store.commit('disableLoader')
            })
        },

        aprovarAgendamento: function(key, aprovar){
            var titulo, texto, confirmText, situacao;
            if(aprovar){
                titulo = 'Aprovar'
                texto = 'confirmada'
                confirmText = 'confirme'
                situacao = 'aprovado'
            }else{
                titulo = 'Reprovar'
                texto = 'cancelada'
                confirmText = 'cancele'
                situacao = 'reprovado'
            }
            Swal.fire({
                title: `${titulo} agendamento?`,
                type: 'question',
                html: 
                    `<div class="ui form">` +
                        `<div class="field"><label>Mensagem</label>`+
                        `<textarea cols="30" rows="5" id="mensagem"></textarea>`+
                    `</div></div>`+
                    `<div>A consulta do(a) paciente ${this.agendamentos[key].paciente.nome} será ${texto} na data `+
                    `${this.agendamentos[key].data} às ${this.agendamentos[key].horario}.</div>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Sim, ${confirmText} o agendamento!`,
                cancelButtonText: 'Não'
            }).then((result) => {
                if(result.value){
                    axios.put(process.env.API + `/agendamentos/${key}`, {
                        situacao: situacao,
                        mensagem: $("#mensagem").val(),
                    }).then(response => {
                        this.agendamentos[key].situacao = situacao
                        Swal.fire({
                            position: 'top-end',
                            type: 'success',
                            title: response.data,
                            toast: true,
                            timer: 2500,
                            showConfirmButton: false
                        })
                    }).catch(error => {
                        Swal.fire({
                            position: 'top-end',
                            type: 'error',
                            title: error.response.data,
                            toast: true,
                            timer: 2500,
                            showConfirmButton: false
                        })
                    }).then(() => {
                        this.$store.commit('disableLoader')
                    })
                }
            })
        },
    }
}
</script>

<style>

</style>