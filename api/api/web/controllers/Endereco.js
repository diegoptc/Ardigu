const Endereco = require('../models/Endereco')

module.exports = {
  getEndereco: async (cep) => {
    const endereco = await Endereco.buscarEndereco(cep)
    if (endereco !== null) return { code: 200, message: endereco }
    return { code: 404, message: 'O endereço não foi encontrado!' }
  }
}
