const mail = require('./mail')

function sendIndex(_, res) {
    res.sendFile(`${__dirname}/public/index.html`)
}

module.exports = sendIndex;