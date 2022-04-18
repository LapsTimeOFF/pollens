const config = require('./config.json')
const axios = require('axios')
const nodemailer = require('nodemailer')
const log = console.log;

let color = config.colors[0]

function htmlForm(res) {
    let final = ""

    for (let _i = 0; _i < res.length; _i++) {
        const risk = res[_i];
        color = config.colors[risk.level]

        final += `<br><br><u>${risk.pollenName} :</u><br>Niveau : <p style="color: ${color};">${risk.level}</p>`
    }

    return final
}

async function sendMail() { // J'utilise async pour le sendMail
    const transporter = nodemailer.createTransport(config.smtp)
    
    let result = ""

    await axios
        .get(`https://pollens.fr/risks/thea/counties/${config.countyNumber}`)
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            result = res.data
        })

    color = config.colors[result.riskLevel]

    await transporter.sendMail({
        from: '"Pollen Info" <'+config.smtp.auth.user+'>', // J'utilise la config pour éviter de leak mon mail perso :|
        to: config.receivers, // Le spam... C'EST MAL. et c'est chiant.
        subject: "Bilan Pollen",
        html: `<b>Bonjour,</b><br><br><p>Voici le bilan d'alerte pollen pour le département <b>${result.countyNumber} - ${result.countyName}</b> :<br>Niveau d'alerte du département :</p> <p style="color: ${color};">${result.riskLevel}</p>${htmlForm(result.risks)}`
    })
    log('Email envoyé');
}

module.exports = sendMail();