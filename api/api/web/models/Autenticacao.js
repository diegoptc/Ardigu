// const firebase = require('firebase-admin')
const firebaseC = require('firebase')

module.exports = {
  redefinirSenhaEmail: (email) => {
    return new Promise((resolve, reject) => {
      firebaseC.auth().sendPasswordResetEmail(email).then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  }
}
