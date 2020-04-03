<template>
    <div @keyup.enter="autenticarUsuario">
        <Loading v-if=this.$store.state.loader></Loading>
            <div class="ui container">
            <div class="ui grid middle aligned" id="container">
                <div class="centered row">
                    <div class="aligned column">
                        <div class="ui segment">
                            <h1 class="ui dividing header">Ardigu</h1>
                            <div class="ui form">
                                <div class="field">
                                    <input type="text" placeholder="E-mail" v-model="usuario.email">
                                </div>
                                <div class="field">
                                    <input type="password" placeholder="Senha" v-model="usuario.senha">
                                </div>
                                <button class="ui fluid large blue button" @click="autenticarUsuario">Entrar</button>
                            </div>
                            <div style="margin-top: 30px;">
                                <a @click="recuperarSenha">Esqueceu a senha?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal name="recuperar-senha" :height="150">
            <recuperar-senha
                    :email=usuario.email
                    @fechaModal="fechaModal"
            ></recuperar-senha>
        </modal>
    </div>
</template>

<script>
import Loading from '@/components/layout/Loading'
import RecuperarSenha from './RecuperarSenha'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
    name: 'Login',

    directives: {
        focus: {
            inserted: function(el){
                el.focus();
            }
        }
    },

    components: {
        Loading,
        RecuperarSenha
    },
    
    data(){
        return {
           usuario: {
               'email': '',
               'senha': ''
           },
        }
    },

    mounted(){
        const userToken = localStorage.getItem('userToken')
        if(userToken){
            this.$store.commit('setToken', userToken)
            this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')))
            this.$router.push({name: 'Dashboard'})
        }
    },

    methods: {
        autenticarUsuario: function(){
            axios.post(process.env.API  + "/gerentes/login", this.usuario)
            .then(response =>{
                this.$store.commit('setToken', response.data.token)
                this.$store.commit('setUser', response.data.user)
                localStorage.setItem('userToken', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                this.$router.push({name: 'Dashboard'})
            })
            .catch(error => {
                console.log(error)
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

        recuperarSenha: function() {
            this.$modal.show('recuperar-senha')
        },

        fechaModal: function(){
            this.$modal.hide('recuperar-senha')
        }
    }
}
</script>

<style scoped>
    .segment {
        background-color: #f0f8ff !important;
    }

    .column {
    max-width: 450px;
    }

    #container {
        height: 100vh;
        width: 100%;
    }

    .header {
        font-family: 'Staatliches', cursive;
    }
</style>