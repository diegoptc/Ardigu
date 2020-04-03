import Vue from 'vue';
import App from './App';
import router from './router';
import vmodal from 'vue-js-modal';
import store from './store'
import http from './interceptors/http'
import VueSocketIO from 'vue-socket.io'

http()
//configurações padrões do axios

//use's
Vue.use(vmodal)

Vue.use(new VueSocketIO({
    debug: true,
    connection: process.env.API,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))


Vue.config.productionTip = false;

//segurança das rotas
router.beforeEach((to, from, next) => {
  const token = store.state.userToken
  const requerAuth = to.matched.some(record => record.meta.requerAuth)
  
  if(requerAuth && !token) next('login');
  else if(!requerAuth && token) next('/');
  else next();
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});