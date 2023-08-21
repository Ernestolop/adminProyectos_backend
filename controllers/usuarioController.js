import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import {emailRegistro, emailOlvidePassword} from '../helpers/email.js';

const registrar = async (req, res) => {
    //evitar duplicados
    const {email} = req.body;
    const existenciausuario = await Usuario.findOne({email});
    if(existenciausuario){
        return res.status(400).json({msg: 'El usuario ya existe'});
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();    
        await usuario.save();
        //enviar email de confirmacion
        await emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });
        res.json({msg: 'Usuario registrado correctamente, revisa tu correo para confirmar tu cuenta'});    
    } catch (error) {
        console.log(error);
    }   
}

const autenticar = async (req, res) => {
    const {email, password} = req.body;
    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        return res.status(404).json({msg: 'El usuario no existe'});
    }
    //comprobar si el usuario esta confirmado
    console.log(usuario.confirmado);
    if (!usuario.confirmado) {
        return res.status(403).json({msg: 'El usuario no esta confirmado'});
    }
    //comprobar si el password es correcto
    if(!await usuario.compararPassword(password)){
        return res.status(401).json({msg: 'Contraseña incorrecta'});
    }else{
        res.json({
            _id : usuario._id,
            nombre : usuario.nombre,
            email : usuario.email,
            token : generarJWT(usuario._id)
        });
    }
}

const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});
    if(!usuarioConfirmar){
        return res.status(403).json({msg: 'Token no valido'});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;
    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        return res.status(404).json({msg: 'No existe un usuario con ese email'});
    }
    try {
        usuario.token = generarId();
        await usuario.save();
        //enviar email con instrucciones para reestablecer el password
        await emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        })
        res.json({msg: 'Se ha enviado un correo con las instrucciones para reestablecer tu contraseña'});
    } catch (error) {
       console.log(error); 
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const usuario = await Usuario.findOne({token});
    if(!usuario){
        return res.status(403).json({msg: 'Token no valido'});
    }
    res.json({msg: 'Token valido y usuario encontrado'});
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({token});

    if(!usuario){
        return res.status(403).json({msg: 'Token no valido'});
    }

    try {
        usuario.password = password;
        usuario.token = '';
        await usuario.save();
        res.json({msg: 'Contraseña actualizada correctamente'});
    } catch (error) {
        console.log(error);
    }

}

const perfil = async (req, res) => {
    const { usuario } = req;
  
    res.json(usuario);
  };

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
};