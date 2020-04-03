const Agendamento = require('../controller/Agendamento')

module.exports = (app) => {
  app.post('/agendamentos', async (request, response) => {
    const res = await Agendamento.postAgendamento(request.body)
    response.status(res.code).send(res.message)
  })

  app.delete('/agendamentos/:key', async (request, response) => {
    const { key } = request.params
    const res = await Agendamento.deleteAgendamento(key)
    response.status(res.code).send(res.message)
  })

  app.get('/agendamentos/:cpf', async (request, response) => {
    const { cpf } = request.params
    const res = await Agendamento.getHistorico(cpf)
    response.status(res.code).send(res.message)
  })

  app.get('/horarios/:data', async (request, response) => {
    const { data } = request.params
    const res = await Agendamento.getHorarios(data)
    response.status(res.code).send(res.message)
  })
}
