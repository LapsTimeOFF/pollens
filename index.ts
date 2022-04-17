"use strict";
import { nodemailer } from "nodemailer"
import * as config from "./config.json"
const log = console.log;

async function main() { // J'utilise async pour le sendMail
    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure, 
        auth: config.smtp.auth
    })

    await transporter.sendMail({
        from: '"Pollen Info" <'+config.smtp.auth.user+'>', // J'utilise la config pour éviter de leak mon mail perso :|
        to: config.receivers, // Le spam... C'EST MAL. et c'est chiant.
        subject: "Bilan Pollen",
        html: "<b>Test email</b>"
    })

    log('Email envoyé');
}