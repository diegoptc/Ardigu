const Agendamento = require('../controllers/Agendamento')

module.exports = (app) => {
  app.get('/agendamentos', async (request, response) => {
    const res = await Agendamento.getAgendamentos()
    response.status(res.code).send(res.message)
  })

  app.put('/agendamentos/:key', async (request, response) => {
    const { key } = request.params
    const agendamento = request.body
    const res = await Agendamento.putAgendamentos(key, agendamento)
    response.status(res.code).send(res.message)
  })
}
