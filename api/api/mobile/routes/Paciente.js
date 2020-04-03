const Paciente = require('../controller/Paciente')

module.exports = (app) => {
  app.post('/pacientes/:cpf', async (request, response) => {
    const { cpf } = request.params
    const res = await Paciente.logar(cpf)
    response.status(res.code).send(res.message)
  })
}
