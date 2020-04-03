import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController, Events } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-mensagem',
  templateUrl: './mensagem.page.html',
  styleUrls: ['./mensagem.page.scss'],
})
export class MensagemPage implements OnInit {
  private api: string = environment.api
  private mensagens: any

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public events: Events
  ) { 
    this.carregarMensagens()
  }

  ngOnInit() { }

  logOut() {
    this.events.publish('user:logout');
  }
  async carregarMensagens() {
    const loading = await this.loadingCtrl.create({
      message: "Buscando histórico...",
    })
    await loading.present()
    const paciente = await this.getPaciente()
    const key = Object.keys(paciente)[0]
    const cpf = paciente[key].cpf
    this.http.get(`${this.api}/agendamentos/${cpf}`, {}).subscribe((response) => {
        this.mensagens = response
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

  ionViewWillEnter() {
    this.carregarMensagens()
  }
}
