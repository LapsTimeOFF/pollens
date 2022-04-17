"use strict";
const nodemailer = require('nodemailer')
const config = require('./config.json')
const axios = require('axios')
const JSON5 = require('json5')
const log = console.log;

function htmlForm(res) {
    let final = ""

    for (let _i = 0; _i < res.length; _i++) {
        const risk = res[_i];
        
        final = final + `<br><br><u>${risk.pollenName} :</u><br>    Niveau : ${risk.level}`
    }

    return final
}

async function main() { // J'utilise async pour le sendMail
    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure, 
        auth: config.smtp.auth
    })
    
    let result = ""

    await axios
        .get(`https://pollens.fr/risks/thea/counties/${config.countyNumber}`)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
            result = res.data
        })
    
    log(result)

    await transporter.sendMail({
        from: '"Pollen Info" <'+config.smtp.auth.user+'>', // J'utilise la config pour éviter de leak mon mail perso :|
        to: config.receivers, // Le spam... C'EST MAL. et c'est chiant.
        subject: "Bilan Pollen",
        html: `<b>Bonjour,</b><br><br><p>Voici le bilan d'alerte pollen pour le département <b>${result.countyNumber} - ${result.countyName}</b> :<br>Niveau d'alerte du département : ${result.riskLevel}</p>${htmlForm(result.risks)}`
    })
    log('Email envoyé');
}

main().catch(console.error);