const Paciente = require('../models/Paciente')

module.exports = {
  logar: async (cpf) => {
    if (Paciente.validarCPF(cpf) === false) {
      return { code: 400, message: 'CPF inválido!' }
    } else {
      const res = await Paciente.logar(cpf)
      if (res) return { code: 200, message: res }
      return { code: 404, message: 'CPF não encontrado!' }
    }
  }
}
