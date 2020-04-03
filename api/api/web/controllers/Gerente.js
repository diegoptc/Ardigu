const Gerente = require('../models/Gerente')

module.exports = {
  postGerente: async (gerente) => {
    const validacoes = Gerente.validarGerente(gerente)
    if (validacoes !== true) {
      return { code: 400, message: validacoes }
    } else {
      const res = await Gerente.cadastrar(gerente)
      if (res === true) return { code: 200, message: 'Cadastrado com sucesso. Um e-mail para definir a senha foi enviado!' }
      return { code: 409, message: res }
    }
  },

  postGerenteLogin: async (email, senha) => {
    const user = await Gerente.logar(email, senha)
    if (user instanceof Object) return { code: 200, message: user }
    return { code: 409, message: user }
  },

  putGerenteLogin: async (email) => {
    const res = await Gerente.resetSenha(email)
    if (res === true) return { code: 200, message: `E-mail de redefinição enviado para "${email}"` }
    return { code: 409, message: res }
  }
}
