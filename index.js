const config = require('./config.json')

const expressHandler = require('./expressHandler')

const express = require('express')
const log = console.log;

const app = express();

async function main() {
    createLink('/', expressHandler.sendIndex)
    createLink('/api/v1/mail', expressHandler.sendMail)
    startExpress(config.api.port)
}

async function createLink(url, handler) {
    if(url === undefined || handler === undefined){ log('No url or handler defined for createLink()'); return }
    app.get(url, (req, res) => {
        log('Request on '+url)
        handler(req, res)
    })
    log(`Link Register : URL : ${url}`)
}

async function startExpress(port) {
    app.listen(port, () => {
        log('Écoute sur http://localhost:' + port)
    })
}

main().catch(console.error);