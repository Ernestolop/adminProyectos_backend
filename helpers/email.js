import nodemailer from 'nodemailer';


export const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //info del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>', // sender address
        to: email, // list of receivers
        subject: "UpTask - Confirma tu cuenta", // Subject line
        text: "Confirma tu cuenta en UpTask", // plain text body
        html: `<p>Hola ${nombre}, comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla haciendo click en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export const emailOlvidePassword = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //info del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>', // sender address
        to: email, // list of receivers
        subject: "UpTask - Reestablece tu contraseña", // Subject line
        text: "Reestablece tu contraseña en UpTask", // plain text body
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu contraseña</p>
        <p>Sigue el siguiente enlace para reestablecer tu contraseña:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Confirmar cuenta</a>
        <p>Si tu no solicitaste esta acción, puedes ignorar el mensaje</p>
        `
    })
}