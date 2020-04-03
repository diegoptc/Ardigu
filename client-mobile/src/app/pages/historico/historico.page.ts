import { Component, OnInit } from '@angular/core'
import { LoadingController, AlertController, ToastController, Events } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'

import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss']
})
export class HistoricoPage implements OnInit {
  private api: string = environment.api
  private historico: any

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public events: Events
  ) {}

  ngOnInit() {}

  logOut() {
    this.events.publish('user:logout');
  }
  async carregarHistorico() {
    const loading = await this.loadingCtrl.create({
      message: "Buscando histórico...",
    })
    await loading.present()
    const paciente = await this.getPaciente()
    const key = Object.keys(paciente)[0]
    const cpf = paciente[key].cpf
    this.http.get(`${this.api}/agendamentos/${cpf}`, {}).subscribe((response) => {
      this.historico = response
    }, error => {
    }).add(async () => {
      await loading.dismiss()
    })
  }

  getPaciente(){
    return new Promise((resolve, reject) => {
      this.storage.get('paciente').then((p) => {
        const paciente = JSON.parse(p)
        resolve(paciente)
      })
    })
  }

  async cancelarAgendamento(key){
    const alert = await this.alertCtrl.create({
      header: "Cancelar agendamento?",
      message: "Essa operação é irreversível.",
      buttons : [{
        text: "Confirmar",
        cssClass: "primary",
        handler: async () => {
          const loading = await this.loadingCtrl.create({
            message: "Cancelando...",
          })
          await loading.present()
          this.http.delete(`${this.api}/agendamentos/${key}`).subscribe(async () => {
          }, error => {
            return
          }).add(async () => {
            await loading.dismiss()
            this.carregarHistorico()
          })    
        }
      },{
        text: "Cancelar",
        cssClass: "secondary",
        role: "cancel",
        handler: () => { return }
      }]
    })
    await alert.present()
  }

  async toastMessage(header: string, message: string, color: string){
    const toast = await this.toastCtrl.create({
      header: header,
      message: message,
      duration: 2500,
      position: 'top',
      color: color,
      buttons: [{
        text: 'X',
        role: 'cancel',
        handler: () => { return }
      }]
    })
    toast.present()
  }

  ionViewWillEnter(){
    this.carregarHistorico()
  }
}
