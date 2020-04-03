<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App',
  data(){
      return {
          menuUsuario: false,
      }
  },
  methods: {
      menuUsuarioShow: function(){
          if(!this.menuUsuario){
              this.menuUsuario = true
          }else{
              this.menuUsuario = false
          }
      }
  }
};
</script>

<style>
</style>
