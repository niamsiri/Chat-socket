const express = require('express')
const router = express()

const path = require('path');

router.get('/chat', function (requesr, response) {
    response.sendFile(path.join(__dirname + '/chat.html'));
});

module.exports = router;