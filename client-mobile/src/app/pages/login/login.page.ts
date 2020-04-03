import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/storage'
import { environment } from '../../../environments/environment'
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  private cpf: string = ''
  private api: string = environment.api

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
  ) {
    this.storage.clear()
  }

  private cpfMask = {
    mask: '000.000.000-00', 
    type: 'num'
  }

  ngOnInit() {}

  async consultarCPF() {
    //const cpf = this.cpf.replace(/\D/g, '')
    const cpf = this.cpf;
    if(cpf === '') {
      return this.toastMessage('Informe seu CPF!', '', 'danger')
    }else {
      const loading = await this.loadingCtrl.create({
        message: "Consultando CPF...",
      })
      await loading.present();
      this.http.post(`${this.api}/pacientes/${cpf}`, {}, {}).subscribe((response) => {
        this.storage.set('paciente', JSON.stringify(response))
        this.navCtrl.navigateRoot('/home');
      }, error => {
        this.toastMessage(error.error, '', 'danger')
      }).add(async () => {
        await loading.dismiss()
      })
    }
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
    toast.present();
  }
}
