<template>
    <div>
        <div class="ui container">
            <div class="ui grid">
                <div class="row">
                    <div class="column"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AprovarAgendamento',

    props: {
        key: {
            type: String
        }
    },

    data(){
        return {
            mensagem: '',
            
        }
    }
}
</script>

<style>

</style>