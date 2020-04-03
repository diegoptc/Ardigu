const firebaseAdmin = require('firebase-admin')
const firebase = require('firebase')
const joi = require('@hapi/joi')
const crypto = require('crypto')

const joiErrors = {
  'string.pattern.base': 'Campo inválido',
  'string.empty': 'Campo vazio',
  'string.min': 'Campo deve ter 6 ou mais caracteres',
  'string.email': 'E-mail inválido',
  'any.required': 'Campo obrigatório'
}

const authErrors = {
  'auth/invalid-email': 'E-mail inválido',
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Esse e-mail já foi cadastrado',
  'auth/email-already-exists': 'Esse e-mail já foi cadastrado',
  'auth/weak-password': 'Senha deve ter 6 ou mais caracteres.'
}

module.exports = {
  validarGerente: (gerente) => {
    const schema = joi.object().keys({
      nome: joi.string().pattern(/^[a-zA-ZéúíóáÉÚÍÓÁèùìòàçÇÈÙÌÒÀõãñÕÃÑêûîôâÊÛÎÔÂëÿüïöäËYÜÏÖÄ\- \s]+$/).required(),
      email: joi.string().email().required()
    })
    const { error } = schema.validate(gerente, { abortEarly: false })
    if (error) {
      const details = error.details
      const errors = []
      for (const i in details) {
        errors.push({
          label: details[i].context.label,
          message: joiErrors[details[i].type] === undefined ? 'Campo inválido' : joiErrors[details[i].type]
        })
      }
      return errors
    }
    return true
  },

  logar: (email, senha) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, senha).then((user) => {
        const { uid } = user.user
        firebaseAdmin.auth().createCustomToken(uid).then((token) => {
          resolve({ user: user.user.providerData[0], token: token })
        })
      }).catch((error) => {
        let e = authErrors[error.code]
        if (!e) e = error.code
        resolve(e)
      })
    })
  },

  resetSenha: (email) => {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve(true)
      }).catch((error) => {
        let e = authErrors[error.code]
        if (!e) e = error.code
        resolve(e)
      })
    })
  },

  cadastrar: (gerente) => {
    return new Promise((resolve, reject) => {
      firebaseAdmin.auth().createUser({
        displayName: gerente.nome,
        email: gerente.email,
        password: hash(`${gerente.nome}${new Date().getTime().toString()}`)
      }).then(async () => {
        await firebase.auth().sendPasswordResetEmail(gerente.email)
        resolve(true)
      }).catch((error) => {
        let e = authErrors[error.code]
        if (!e) e = error.code
        resolve(e)
      })
    })
  }
}

function hash (text) {
  const h = crypto.createHash('sha256')
  h.update(text)
  return h.digest('hex')
}
