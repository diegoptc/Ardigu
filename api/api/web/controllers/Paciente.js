const Paciente = require('../models/Paciente')

module.exports = {
  postPaciente: async (paciente) => {
    const validacoes = await Paciente.validarPaciente(undefined, paciente)
    if (validacoes instanceof Object) {
      return { code: 400, message: validacoes }
    } else {
      const res = await Paciente.cadastrar(paciente)
      if (res !== false) return { code: 200, message: 'Paciente cadastrado com sucesso', key: res }
      return { code: 500, message: 'Ocorreu um erro inesperado, tente novamente!' }
    }
  },

  getPacientes: async () => {
    const res = await Paciente.listar()
    if (res !== null) return { code: 200, message: res }
    return { code: 500, message: 'Ocorreu um erro inesperado, tente novamente!' }
  },

  putPaciente: async (key, paciente) => {
    const validacoes = await Paciente.validarPaciente(key, paciente)
    if (validacoes instanceof Object) {
      return { code: 400, message: validacoes }
    } else if (Paciente.atualizar(key, paciente)) {
      return { code: 200, message: 'Paciente atualizado com sucesso!' }
    } else {
      return { code: 500, message: 'Ocorreu um erro inesperado, tente novamente!' }
    }
  },

  deletePaciente: async (key) => {
    const deletar = await Paciente.deletar(key)
    if (deletar) return { code: 200, message: 'Paciente removido com sucesso!' }
    return { code: 500, message: 'Não foi possível remover o paciente!' }
  }
}
