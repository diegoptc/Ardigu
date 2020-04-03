import Vue from 'vue';
import Router from 'vue-router';

//import component models
import Login from '@/components/Login/Login';
import ViewPaciente from '@/components/GerenciarPaciente/ViewPaciente';     
import ViewAgendamento from '@/components/GerenciarAgendamento/ViewAgendamento';

//import layout
import Dashboard from '@/components/layout/Dashboard';
import Error404 from '@/components/layout/Error404';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requerAuth: true,
      },
      children: [
          {
            path: '/gerenciarpaciente',
            name: 'ViewPaciente',
            component: ViewPaciente,
            meta: {
              requerAuth: true,
            },
          },
          {
            path: '/gerenciaragendamento/',
            name: 'ViewAgendamento',
            component: ViewAgendamento,
            meta: {
              requerAuth: true,
            }
          }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '*',
      name: 'Error404',
      component: Error404,
      meta: {
        requerAuth:true
      }
    }
  ],
});