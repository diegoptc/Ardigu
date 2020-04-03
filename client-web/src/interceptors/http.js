import axios from 'axios'
import store from '../store/index'

export default function setup() {
    axios.interceptors.request.use(function(config){
        store.commit('activeLoader')
        const token = store.state.userToken
        if(token){
            config.headers.Authorization = token
        }
        return config
    }, function(error){
        store.commit('disableLoader')
        return Promisse.reject(error)
    });

}