const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { initDatabase } = require('./api/config/database')
require('dotenv').config()

const api = new Express()
const server = require('http').createServer(api)
const io = require('socket.io')(server)
const moment = require('moment')

api.use(cors({
  origin: '*',
  methods: 'POST, GET, PUT, DELETE, PATCH, HEAD',
  optionsSuccessStatus: 204
}))
api.use(bodyParser.json())
api.disable('x-powered-by')

initDatabase()

// API WEB
require('./api/web/routes/Paciente')(api)
require('./api/web/routes/Endereco')(api)
require('./api/web/routes/Gerente')(api)
require('./api/web/routes/Agendamento')(api)
require('./api/web/routes/Autenticacao')(api)

// API MOBILE
require('./api/mobile/routes/Paciente')(api)
require('./api/mobile/routes/Agendamento')(api)

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.on('sendConsulta', data => {
        data.consulta.data = moment(data.data).format("DD-MM-YYYY")
        io.emit('consulta', data)
    });
})

const { PORT } = process.env
server.listen(PORT, () => {
  console.log('Serviço iniciado')
})
