const redis = require('../configs/redis')

let func = {};

func.setSocket = async (socket) => {
    socket.on('disconnect', () => {
        console.log("Client disconnect : " + socket.id)
    });
}

func.connectChat = (io, chanel) => {
    io.on('connection', async (sockets) => {
        sockets ? console.log("Chanel " + chanel + " Client : " + sockets.id) : null;

        await sockets.on(chanel, async (data) => {
            if (data) {
                let emitChat = data
                emitChat.id = sockets.id
                emitChat.created = Date.now()
                io.emit(chanel, emitChat)
            }
        })
    })
}

func.statusChat = async (chanel) => {
    let chanels = JSON.parse(await redis.get("chanelsOpened"));
    let temp_chanels = chanels ? chanels : [];
    let find = temp_chanels.includes(chanel);
    let search = find ? false : true;
    return {
        status: search,
        chanels: temp_chanels
    }

}

module.exports = func