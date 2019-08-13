const express = require('express')
const router = express()
const redis = require('../configs/redis')

const path = require('path');

router.use(express.static(__dirname + '/'));
router.engine('html', require('ejs').renderFile);
router.set('view engine', 'html');
router.set('views', __dirname);

router.get('/chat/:room/:username', async (request, response) => {

    const room = request.params.room
    const username = request.params.username
    let chatList = JSON.parse(await redis.get(room))
    
    response.render('chat.html', {
        room: room,
        username: username,
        chatList:  JSON.stringify(chatList)
    });

});

module.exports = router;