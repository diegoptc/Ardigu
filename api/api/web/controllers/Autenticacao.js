const Autenticacao = require('../models/Autenticacao')

module.exports = {
  redefinirSenhaEmail: (email) => {
    const sendEmail = Autenticacao.redefinirSenhaEmail(email)
    if (sendEmail === false) return { code: 500, message: 'Não foi possível enviar o e-mail!' }
    return { code: 200, message: `Um link de redefinição foi enviado para ${email}!` }
  }
}
