"use strict";
const nodemailer = require('nodemailer')
const config = require('./config.json')
const express = require('express')
const log = console.log;

const app = express();

async function main() {
    startExpress(config.api.port)
}

async function createLink(url, handler) {
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