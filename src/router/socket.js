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

router.get('/rooms', async (request, response) => {

    let rooms = await redis.get("chanelsOpened")
    rooms = rooms ? rooms : [];
    return response.status(200).send(rooms)

})

router.get('/rooms/clear', async (request, response) => {

    await redis.delete("chanelsOpened");
    return response.status(200).send("Delete all rooms in history")

})

module.exports = router;