const redis = require('../configs/redis')

let func = {};

func.connectChat = (io, chanel) => {
    io.on('connection', async (sockets) => {
        sockets ? console.log("Chanel " + chanel + " Client : " + sockets.id) : null;

        await sockets.on(chanel, async (data) => {

            if (data) {

                let clientCurrent = (JSON.parse(await redis.get('client_' + data.session_id))) || []

                let user = clientCurrent.filter(element => {
                    return element.user_id == data.user_id
                });
                if (user.length > 0) {
                    let chatList = JSON.parse(await redis.get(data.session_id))
                    let historyChat = chatList ? chatList : []

                    let emitData = {
                        id: sockets.id,
                        message: data.message,
                        send_by_name: user[0].username,
                        send_by_id: data.user_id,
                        created: Date.now()
                    }

                    historyChat.push(emitData)
                    await redis.store(chanel, historyChat)
                    io.emit(chanel, emitData)
                }

            }
        })
    })
}

func.emitChatRoom = (io, chanel, data) => {
    io.emit(chanel, data)
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