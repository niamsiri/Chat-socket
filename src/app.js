const http = require('http')

const app = require('./configs/express');

const io = require('./configs/socket');
const lib = require('./library/socket')
const init = require('./configs/init');

let chatChanel = io.of('/');

http.createServer(app).listen(8091, async() => {

    await init.resetState(chatChanel)

    lib.connectChat(chatChanel, 'msg')
    lib.connectChat(chatChanel, 'sent_msg-manager')
    lib.connectChat(chatChanel, 'mymove')
    lib.connectChat(chatChanel, 'player_enter')

    console.log(`Socket server Start!`)
})