const redis = require('./redis')
const livechat = require('../library/socket')

let init = {};

init.resetState = async (io) => {

    let chanels = JSON.parse(await redis.get("chanelsOpened"));
    chanels = chanels ? chanels : []

    for (let i = 0; i < chanels.length; i++) {
        livechat.connectChat(io, chanels[i])
    }

    return chanels
}

module.exports = init