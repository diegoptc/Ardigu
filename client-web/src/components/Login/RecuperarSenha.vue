<template>
    <div class="ui container" style="padding: 20px;">
        <h4 class="ui dividing header">Recuperar Senha</h4>
        <div class="ui form">
            <div class="field">
                <input type="text" v-model="email" placeholder="Informe seu email">
            </div>
        </div>
        <br>
        <div class="ui grid">
            <div class="row center aligned">
               <div class="column">
                   <button class="ui green button" @click="recuperaSenha">Enviar Email</button>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2"
import axios from 'axios'

export default {
   props: {
       "email": {
           type: String
       }
   },

   methods: {
       recuperaSenha: function(){
           axios.post(process.env.API  + "/gerentes/redefinir_senha", {email: this.email})
           .then(response => {
               Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: response.data,
                    toast: true,
                    timer: 5000,
                    showConfirmButton: false
                })
                this.$emit("fechaModal")
           })
           .catch(error => {
               Swal.fire({
                    position: 'top-end',
                    type: 'error',
                    title: error.response.data,
                    toast: true,
                    timer: 5000,
                    showConfirmButton: false
                })
                this.$emit("fechaModal")
           })
           .then(() => {
               this.$store.commit('disableLoader')
           })
       },

       cancelaRecuperacao() {
           this.$emit("cancelaRecuperacao")
       }
   }
}
</script>

<style>

</style>