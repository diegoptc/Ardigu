const firebase = require('firebase-admin')
const joi = require('@hapi/joi')
const validaCPF = require('@fnando/cpf/dist/node')

const joiErrors = {
  'string.pattern.base': 'Campo inválido',
  'string.empty': 'Campo não pode ser vazio',
  'string.email': 'E-mail inválido',
  'any.required': 'Campo obrigatório'
}

module.exports = {
  validarPaciente: async (key, paciente) => {
    const schema = joi.object().keys({
      nome: joi.string().pattern(/^[a-zA-ZéúíóáÉÚÍÓÁèùìòàçÇÈÙÌÒÀõãñÕÃÑêûîôâÊÛÎÔÂëÿüïöäËYÜÏÖÄ\- \s]+$/).required(),
      cpf: joi.string().required(),
      email: joi.string().email().required(),
      telefone: joi.string().required(),
      endereco: joi.object({
        bairro: joi.string().required(),
        cep: joi.string().required(),
        localidade: joi.string().required(),
        logradouro: joi.string().required(),
        numero: joi.number().integer().required(),
        uf: joi.string().required(),
        complemento: joi.any(),
        gia: joi.any(),
        ibge: joi.any(),
        unidade: joi.any()
      }).required()
    })
    const { error } = schema.validate(paciente, { abortEarly: false })
    const errors = []
    if (error) {
      const details = error.details
      for (const i in details) {
        errors.push({
          label: details[i].context.label,
          message: joiErrors[details[i].type] === undefined ? `${details[i].context.label} inválido` : joiErrors[details[i].type]
        })
      }
    }
    if (validaCPF.isValid(paciente.cpf) === false) {
      errors.push({
        label: 'cpf',
        message: 'CPF inválido!'
      })
    }
    if(!await verifyOldCPF(key, paciente.cpf)){
        const cpfUnico = await uniqueCPF(paciente.cpf)
        if (cpfUnico === false) {
            errors.push({
                label: 'cpf',
                message: 'Já existe um usuário com esse CPF!'
            })
        }
    }
    if(!await verifyOldEmail(key, paciente.email)){
        const emailUnico = await uniqueEmail(paciente.email)
        if (emailUnico === false) {
            errors.push({
                label: 'email',
                message: 'Já existe um usuário com esse e-mail!'
            })
        }
    }
    if (errors.length === 0) return false
    return errors
  },

  cadastrar: (paciente) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('paciente').push(paciente).then((p) => {
        resolve(p.key)
      }).catch(() => {
        resolve(false)
      })
    })
  },

  listar: () => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('paciente').once('value', snapshot => {
        const pacientes = {}
        snapshot.forEach((paciente) => {
          pacientes[paciente.key] = paciente.val()
        })
        resolve(pacientes)
      }).catch(() => {
        resolve(null)
      })
    })
  },

  atualizar: (key, paciente) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`paciente/${key}`).update(paciente).then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  },

  deletar: (key) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`paciente/${key}`).remove().then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  }
}

function uniqueCPF (cpf) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('paciente').orderByChild('cpf').equalTo(cpf).once('value', snapshot => {
      if (snapshot.val()) resolve(false)
      resolve(true)
    })
  })
}

function verifyOldCPF (key, cpf) {
    if(key){
        return new Promise((resolve, reject) => {
            firebase.database().ref(`paciente/${key}`).once('value').then((snapshot) => {
                if(cpf == snapshot.val().cpf){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
    }else{
        return false
    }
}

function uniqueEmail (email) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('paciente').orderByChild('email').equalTo(email).once('value', snapshot => {
      if (snapshot.val()) resolve(false)
      resolve(true)
    })
  })
}

function verifyOldEmail(key, email){
    if(key){
        return new Promise((resolve, reject) => {
            firebase.database().ref(`paciente/${key}`).once('value').then((snapshot) => {
                if(email == snapshot.val().email){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
    }else{
        return false
    }
}
