const Agendamento = require('../models/Agendamento')

module.exports = {
  getAgendamentos: async () => {
    const res = await Agendamento.listar()
    if (res !== null) return { code: 200, message: res }
    return { code: 500, message: 'Ocorreu um erro inesperado, tente novamente!' }
  },

  putAgendamentos: async (key, agendamento) => {
    const res = await Agendamento.putAgendamento(key, agendamento)
    if (res !== null) return { code: 200, message: 'As informações foram atualizadas!' }
    return { code: 500, message: 'Ocorreu um erro inesperado, tente novamente!' }
  }
}
