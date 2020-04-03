const firebase = require('firebase-admin')

module.exports = {
  listar: () => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('agendamento').once('value', snapshot => {
        const agendamentos = {}
        snapshot.forEach(agend => {
          agendamentos[agend.key] = agend.val()
        })
        resolve(agendamentos)
      }).catch(() => {
        resolve(null)
      })
    })
  },

  putAgendamento: (key, agendamento) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`agendamento/${key}`).update(agendamento).then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  }
}
