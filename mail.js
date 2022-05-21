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

        final += `<tr><td><u>${risk.pollenName}</u></td> <td><p style="color: ${color};">${risk.level}</p></td></tr>`
    }

    return final
}

module.exports.sendMail = async function () { // J'utilise async pour le sendMail
    log('sendMail on ' + __filename + ' started')
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
        html: `<style>table, th, td {border: 1px solid black;}</style><b>Bonjour,</b><br><br><p>Voici le bilan d'alerte pollen pour le département <b>${result.countyNumber} - ${result.countyName}</b> :<br>Niveau d'alerte du département :</p> <p style="color: ${color};">${result.riskLevel}</p><table><tr><td>Pollen :</td><td>Niveau :</td></tr>${htmlForm(result.risks)}</table>`
    })
    log('Email envoyé');
};