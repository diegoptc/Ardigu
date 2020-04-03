const Gerente = require('../controllers/Gerente')

module.exports = (app) => {
  app.post('/gerentes', async (request, response) => {
    const res = await Gerente.postGerente(request.body)
    response.status(res.code).send(res.message)
  })

  app.post('/gerentes/login', async (request, response) => {
    const { email, senha } = request.body
    const res = await Gerente.postGerenteLogin(email, senha)
    response.status(res.code).send(res.message)
  })

  app.put('/gerentes/login/:email', async (request, response) => {
    const { email } = request.params
    const res = await Gerente.putGerenteLogin(email)
    response.status(res.code).send(res.message)
  })
}
