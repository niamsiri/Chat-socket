const redis = require('../configs/redis')

let func = {};

func.connectChat = (io, chanel) => {
    io.on('connection', async (sockets) => {
        sockets ? console.log("Chanel " + chanel + " Client : " + sockets.id) : null;

        await sockets.on(chanel, async (data) => {
            if (data) {
                let chatList = JSON.parse(await redis.get(chanel))
                let historyChat = chatList ? chatList : []
                let emitChat = data
                emitChat.id = sockets.id
                emitChat.created = Date.now()
                console.log(emitChat)
                historyChat.push(emitChat)
                await redis.store(chanel, historyChat)
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

func.initSaveChat = async (chanels) => {
    let opened_chanels = JSON.parse(await redis.get("chanelsOpened"))
    let temp_chanels = opened_chanels ? opened_chanels : [];
    chanels.forEach(room => {
        temp_chanels.push(room)
    });

    return await redis.store("chanelsOpened", temp_chanels)
}

module.exports = func