const mail = require('./mail')


module.exports.sendIndex = function (_, res) {
    res.sendFile(`${__dirname}/public/index.html`)
}

module.exports.sendMail = function (_, res) {
    mail.sendMail()

    res.send({
        "statusCode": 200
    })
}