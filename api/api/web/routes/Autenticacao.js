const Autenticacao = require('../controllers/Autenticacao')

module.exports = (app) => {
  app.post('/gerentes/redefinir_senha', async (request, response) => {
    const { email } = request.body
    const res = await Autenticacao.redefinirSenhaEmail(email)
    response.status(res.code).send(res.message)
  })
}
