const Agendamento = require('../models/Agendamento')

module.exports = {
  postAgendamento: async (consulta) => {
    const res = await Agendamento.agendar(consulta)
    if (res === false) return { code: 500, message: 'Ocorreu um erro inesperado!' }
    return { code: 200, message: res }
  },

  deleteAgendamento: async (key) => {
    const res = await Agendamento.cancelar(key.toString())
    if (res === false) return { code: 500, message: 'Ocorreu um erro inesperado!' }
    return { code: 200, message: 'Agendamento cancelado!' }
  },

  getHistorico: async (cpf) => {
    const res = await Agendamento.historico(cpf)
    if (res === false) return { code: 500, message: 'Ocorreu um erro inesperado!' }
    return { code: 200, message: res }
  },

  getHorarios: async (data) => {
    const res = await Agendamento.horariosDisponiveis(data)
    if (res.length === 0) return { code: 409, message: 'Não existem horários disponíveis nessa data' }
    return { code: 200, message: res }
  }
}
