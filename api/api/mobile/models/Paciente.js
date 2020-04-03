const firebase = require('firebase')
const validaCPF = require('@fnando/cpf/dist/node')

module.exports = {
  validarCPF: (cpf) => {
    if (validaCPF.isValid(cpf) === true) return true
    return false
  },

  logar: (cpf) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('paciente').orderByChild('cpf').equalTo(cpf).limitToFirst(1).once('value', async snapshot => {
        if (snapshot.val() === null) resolve(false)
        else resolve(snapshot.val())
      })
    })
  }
}
