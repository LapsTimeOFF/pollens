const config = require('./config.json')

const expressHandler = require('./expressHandler')

const express = require('express')
const log = console.log;

const app = express();

async function main() {
    createLink('')
    startExpress(config.api.port)
}

async function createLink(url, handler) {
    if(url === undefined || handler === undefined) log('No url or handler defined for createLink()')
    app.get(url, (req, res) => {
        handler(req, res)
    })
}

async function startExpress(port) {
    app.listen(port, () => {
        log('[API OK] Écoute sur http://localhost:' + port)
    })
}

main().catch(console.error);