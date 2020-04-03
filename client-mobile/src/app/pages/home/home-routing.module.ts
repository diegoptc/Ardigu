import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'agendamento',
        loadChildren: () => import('../agendamento/agendamento.module').then(m => m.AgendamentoPageModule)
      },
      {
        path: 'historico',
        loadChildren: () => import('../historico/historico.module').then(m => m.HistoricoPageModule)
      },
      {
        path: 'mensagem',
        loadChildren: () => import('../mensagem/mensagem.module').then(m => m.MensagemPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
