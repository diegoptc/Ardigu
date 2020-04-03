import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { NavController, ToastController, AlertController} from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { environment } from '../../../environments/environment'
import { Events } from '@ionic/angular';
import * as moment from 'moment'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
})

export class AgendamentoPage implements OnInit {
  private api: string = ''
  private consulta = {
    paciente: null,
    data: '',
    horario: '',
    motivo: '',
    situacao: 'pendente'
  }
  private dataMinima: string = ''
  private dataMaxima: string = ''
  private horarios = null

  private length: string = '0/200'

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private storage: Storage,
    public events: Events,
    private socket: Socket
  ) { 
    this.api = environment.api
    moment.locale('pt-br')
    this.dataMinima = moment(new Date()).format('YYYY')
    this.dataMaxima = moment(new Date()).add(1, 'years').format('YYYY-MM-DD')
  }

  ngOnInit() { 
      this.socket.connect()
  }

  horariosDisponiveis() {
    this.http.get(`${this.api}/horarios/${this.consulta.data}`, {}).subscribe((response) => {
      this.horarios = response
    }, error => {
      return 
    })
  }

  agendar() {
    if(this.consulta.data && this.consulta.horario && this.consulta.motivo) {
      this.storage.get('paciente').then(async (paciente) => {
        const pacienteObj = JSON.parse(paciente)
        const key = Object.keys(pacienteObj)[0] 
        this.consulta.paciente = pacienteObj[key]
        const alert = await this.alertCtrl.create({
          header: "Solicitar agendamento?",
          message: "A solicitação ficará pendente até ser validada.",
          buttons : [{
            text: "Confirmar",
            cssClass: "primary",
            handler: async () => {
              this.http.post(`${this.api}/agendamentos`, this.consulta, { }).subscribe((response) => {
                this.socket.emit('sendConsulta', {
                    consulta: response['consulta'],
                    key: response['key']
                })
                this.resetConsulta()
                this.toastMessage('Agendamento solicitado, aguarde resposta.', '', 'success')
              }, error => {
                this.toastMessage(error.error, '', 'danger')
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
      }).catch((error) => {
        this.toastMessage('Não foi possível identificar o usuário', '', 'danger')
      })
    }else {
      this.toastMessage('Informe todos os campos!', '', 'danger')
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
    toast.present()
  }

  resetConsulta() {
    this.consulta = {
      paciente: null,
      data: '',
      horario: '',
      motivo: '',
      situacao: 'pendente'
    }
  }

  charCounter() {
    const count = this.consulta.motivo.length
    this.length = `${count}/200`
  }
  logOut() {
    this.events.publish('user:logout');
  }
}
