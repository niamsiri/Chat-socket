const socket = require('socket.io')
const https = require('http')

const app = https.createServer().listen(3101);

const io = socket(app)

module.exports = io

