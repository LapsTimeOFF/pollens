const mail = require('./mail')

function sendIndex(_, res) {
    console.log('Handler started');
    res.sendFile(`${__dirname}/public/index.html`)
}

function sendMail(_, res) {
    console.log('Handler started');
    mail.sendMail()

    res.send({
        "statusCode": 200
    })
}

module.exports = {
    sendIndex,
    sendMail
}