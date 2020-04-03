const firebase = require('firebase')
const moment = require('moment')
const socket = require('socket.io')

module.exports = {
  agendar: (consulta) => {
    return new Promise((resolve, reject) => {
      moment.locale('pt-br')
      consulta.data = moment(consulta.data).format('DD-MM-YYYY')
      firebase.database().ref('agendamento').push(consulta).then((snapshot) => {
        resolve({
            consulta: consulta,
            key: snapshot.key
        })
      }).catch(() => {
        resolve(false)
      })
    })
  },

  cancelar: (key) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`agendamento/${key}`).remove().then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  },

  historico: (cpf) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('agendamento').orderByChild('paciente/cpf').equalTo(cpf).once('value', snapshot => {
        const historico = []
        snapshot.forEach(data => {
          historico.push({
            key: data.key,
            data: data.val()
          })
        })
        resolve(historico)
      }).catch(() => {
        resolve(false)
      })
    })
  },

  horariosDisponiveis: (data) => {
    moment.locale('pt-br')
    const dataAux = moment(data).format('DD-MM-YYYY')
    const horarios = [
      '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
    ]
    if (!data) return horarios
    return new Promise((resolve, reject) => {
      firebase.database().ref('agendamento').orderByChild('data').equalTo(dataAux).once('value', snapshot => {
        if (snapshot.val()) {
          snapshot.forEach(agend => {
            const index = horarios.indexOf(agend.val().horario)
            if (index > -1 && agend.val().situacao !== 'reprovado') {
              horarios.splice(index, 1)
            }
          })
          resolve(horarios)
        } else {
          resolve(horarios)
        }
      })
    })
  }
}
