<template>
<div class="ui grid">
    <Loading v-if=this.$store.state.loader></Loading>
    <div class="three wide column">
        <div class="ui left fixed vertical inverted menu">
            <div class="item">
                <h1>Ardigu</h1>
            </div>
            <router-link to="/gerenciarpaciente" class="item">Gerenciar Paciente</router-link>
            <router-link to="/gerenciaragendamento" class="item">Gerenciar Agendamento</router-link>
            <!--<router-link to="/cadastro" class="item">Gerenciar Usuarios</router-link>-->
        </div>
    </div>
    <div class="ui grid twelve wide column">
        <div class="ui row right aligned">
            <div class="column">
                <div class="ui text menu">
                    <div class="right menu">
                        <div class="ui dropdown item" style="display: none !important">
                            <img src="https://img.icons8.com/bubbles/100/000000/appointment-reminders.png" 
                            class="ui mini circular image">
                            <div class="floating ui red label">1</div>
                        </div>
                        <div class="ui dropdown item" @click="menuUsuarioShow">
                            <img src="https://d2ln1xbi067hum.cloudfront.net/assets/default_user-951af10295a22e5f7fa2fa6165613c14.png" 
                            class="ui mini circular image">
                            <i class="dropdown icon"></i>
                            <div class="menu" style="display: block !important;" v-if="menuUsuario">
                                <h4 class="header">{{ usuario.displayName }}</h4>
                                <div class="item" @click="recuperarSenha">Alterar senha</div>
                                <div class="item" @click="deslogarUsuario">Sair</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <router-view/>
        </div>
        <modal name="recuperar-senha" :height="150">
            <recuperar-senha
                    :email=this.$store.state.user.email
                    @fechaModal="fechaModal"
            ></recuperar-senha>
        </modal>
    </div>
</div>  
</template>

<script>
import Loading from './Loading'
import Swal from 'sweetalert2'
import RecuperarSenha from '../Login/RecuperarSenha'

export default {
    name: 'Dashboard',

    components: {
        Loading,
        RecuperarSenha
    },

    data(){
        return {
            menuUsuario: false,
            usuario: {}
        }
    },

    created() {
        this.usuario = JSON.parse(localStorage.getItem("user"))
        Swal.fire({
            position: 'top-end',
            type: 'success',
            title: `Bem vindo(a)!`,
            toast: true,
            timer: 2500,
            showConfirmButton: false
        })
    },

    methods: {
        menuUsuarioShow: function(){
            if(!this.menuUsuario){
                this.menuUsuario = true
            }else{
                this.menuUsuario = false
            }
        },

        deslogarUsuario: function(){
            this.$store.commit("setToken", "")
            this.$store.commit("setUser", "")
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            this.$router.push({name: 'Login'})
        },
        
        recuperarSenha: function(){
            this.$modal.show('recuperar-senha')
        },

        fechaModal: function(){
            this.$modal.hide('recuperar-senha')
        }
    }
};
</script>

<style>

</style>