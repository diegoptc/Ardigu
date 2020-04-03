const axios = require('axios')

module.exports = {
  buscarEndereco: (cep) => {
    return new Promise((resolve, reject) => {
      axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((endereco) => {
        if (endereco.data.erro) resolve(null)
        else resolve(endereco.data)
      }).catch(() => {
        resolve(null)
      })
    })
  }
}
