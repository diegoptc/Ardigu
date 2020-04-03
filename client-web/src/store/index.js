import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    
    state: {
        loader: false,
        userToken: '',
        user: '',
    },

    mutations: {
        activeLoader (state) {
            state.loader = true
        },

        disableLoader (state) {
            state.loader = false
        },

        setToken(state, token) {
            state.userToken = token
        },

        setUser(state, user){
            state.user = user
        }
    }

})