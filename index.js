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
        let color = "black"

        if(risk.level === 1)
            color = "#00ff00" // vert
        else if(risk.level === 2)
            color = "#adac68" // Jaune
        else if(risk.level === 3)
            color = "#ff0000" // Rouge

        final = final + `<br><br><u>${risk.pollenName} :</u><br>Niveau : <p style="color: ${color};">${risk.level}</p>`
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
            // log(res.data) DEBUG
            result = res.data
        })
    
    // log(result) DEBUG

    await transporter.sendMail({
        from: '"Pollen Info" <'+config.smtp.auth.user+'>', // J'utilise la config pour éviter de leak mon mail perso :|
        to: config.receivers, // Le spam... C'EST MAL. et c'est chiant.
        subject: "Bilan Pollen",
        html: `<b>Bonjour,</b><br><br><p>Voici le bilan d'alerte pollen pour le département <b>${result.countyNumber} - ${result.countyName}</b> :<br>Niveau d'alerte du département : ${result.riskLevel}</p>${htmlForm(result.risks)}`
    })
    log('Email envoyé');
}

main().catch(console.error);