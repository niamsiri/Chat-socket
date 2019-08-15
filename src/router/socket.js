const express = require('express')
const router = express.Router()

const io = require('../configs/socket');
const lib = require('../library/socket')
const redis = require('../configs/redis')

router.get('/create/:room', async (request, response) => {

    let chanelName = request.params.room
    let chanelCurrent = await lib.statusChat(chanelName)
    let chanelsOpened = await redis.store("chanelsOpened", chanelCurrent.chanels)
    chanelsOpened = chanelsOpened ? chanelsOpened : []

    chanelCurrent.status == true ? lib.connectChat(io, chanelName) : false
    chanelCurrent.status == true ? chanelCurrent.chanels.push(chanelName) : false
    chanelCurrent.status == true ? await redis.store("chanelsOpened", chanelCurrent.chanels) : false

    return response.status(200).send({
        status: chanelCurrent.status ? "create room success" : "create room fail.",
        name: chanelName
    })

})

router.get('/history/:room', async (request, response) => {

    let room = request.params.room
    let history = JSON.parse(await redis.get(room))
    return response.status(200).json(history ? history : [])
})

router.get('/client/:key', async (request, response) => {

    let key = request.params.key
    let history = JSON.parse(await redis.get(key))
    return response.status(200).json(history ? history : [])
})

router.get('/rooms', async (request, response) => {

    let rooms = await redis.get("chanelsOpened")
    rooms = rooms ? rooms : [];
    return response.status(200).send(rooms)

})

router.get('/rooms/clearall', async (request, response) => {

    await redis.delete("chanelsOpened");
    await redis.clearCache()

    return response.status(200).send("Clean all database. No room opened. No history chats.")

})

router.get('/rooms/clear', async (request, response) => {

    await redis.delete("chanelsOpened");
    return response.status(200).send("Delete all rooms in history")

})

router.get('/clear/all', async (request, response) => {

    await redis.clearCache()
    return response.status(200).send("Delete all Redis")

})

router.post('/room/join', async (request, response) => {

    const eventName = request.body.eventName
    const branch_id = request.body.branch_id
    const user_id = request.body.user_id
    const username = request.body.username
    const token = request.body.token

    let roomName = eventName + '_' + branch_id
    let clientName = 'client_' + roomName

    let model = {
        eventName: eventName,
        branch_id: branch_id,
        user_id: user_id,
        username: username,
        session_id: roomName,
        token: token,
    }

    let clients = JSON.parse(await redis.get(clientName))

    clients = clients ? clients : [];

    let chanelCurrent = await lib.statusChat(roomName)
    let chanelsOpened = await redis.store("chanelsOpened", chanelCurrent.chanels)
    chanelsOpened = chanelsOpened ? chanelsOpened : []

    chanelCurrent.status == true ? lib.connectChat(io, roomName) : false
    chanelCurrent.status == true ? chanelCurrent.chanels.push(roomName) : false
    chanelCurrent.status == true ? await redis.store("chanelsOpened", chanelCurrent.chanels) : false

    let duplicate = clients.filter(element => {
        return element.user_id == user_id
    });

    if (duplicate.length == 0) {
        clients.push(model)
        await redis.store(clientName, clients)
        lib.emitChatRoom(io, roomName, {
            eventName: eventName,
            send_by_id: user_id,
            send_by_name: username
        })
    }

    return response.status(200).send({
        eventName: eventName + '_result',
        result: chanelCurrent.status ? 1 : 2,
        msg: duplicate.length == 0 ? "join room success!" : "joined room.",
        session_id: roomName
    })
})

router.post('/room/leave', async (request, response) => {

    const eventName = request.body.eventName
    const session_id = request.body.session_id
    const user_id = request.body.user_id

    let clientName = 'client_' + session_id
    let clients = JSON.parse(await redis.get(clientName))
    clients = clients ? clients : []
    
    let duplicate = clients.filter(element => {
        return element.user_id == user_id
    });

    for (var i = 0; i < clients.length; i++) {
        if (clients[i].user_id == user_id) {
            clients.splice(i, 1);
        }
    }
    
    await redis.store(clientName, clients)

    lib.emitChatRoom(io, session_id, {
        eventName: eventName,
        send_by_id: user_id,
        send_by_name: duplicate[0] ? duplicate[0].username : ''
    })

    return response.status(200).send({
        eventName: eventName + '_result',
        result: 1,
        msg: "",
    })
})

module.exports = router;