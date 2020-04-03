import { Component, OnInit } from '@angular/core'
import { ToastController, Events } from '@ionic/angular'
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private toastCtrl: ToastController,
    private storage: Storage,
    public events: Events
  ) {
  }
  
  logOut() {
    this.events.publish('user:logout');
  }
  ngOnInit() {
    this.storage.get('paciente').then((p) => {
      const paciente = JSON.parse(p)
      const key = Object.keys(paciente)[0]
      const nome = paciente[key].nome
      this.toastMessage(`Olá, ${nome}`, '', 'success')
    }).catch(() => {
      this.toastMessage('Bem vindo(a)', '', 'success')
    })
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
}
