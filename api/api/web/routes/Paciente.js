const Paciente = require('../controllers/Paciente')

module.exports = (app) => {
  app.post('/pacientes', async (request, response) => {
    const res = await Paciente.postPaciente(request.body)
    response.status(res.code).send({ message: res.message, key: res.key })
  })

  app.get('/pacientes', async (request, response) => {
    const res = await Paciente.getPacientes()
    response.status(res.code).send(res.message)
  })

  app.put('/pacientes/:key', async (request, response) => {
    const { key } = request.params
    const { paciente } = request.body
    const res = await Paciente.putPaciente(key, paciente)
    response.status(res.code).send(res.message)
  })

  app.delete('/pacientes/:key', async (request, response) => {
    const { key } = request.params
    const res = await Paciente.deletePaciente(key)
    response.status(res.code).send(res.message)
  })
}
