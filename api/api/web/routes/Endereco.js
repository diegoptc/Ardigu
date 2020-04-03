const Endereco = require('../controllers/Endereco')

module.exports = (app) => {
  app.get('/enderecos/:cep', async (request, response) => {
    const { cep } = request.params
    const res = await Endereco.getEndereco(cep)
    response.status(res.code).send(res.message)
  })
}
