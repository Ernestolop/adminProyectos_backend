import express from 'express';
import {
    registrar, 
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from '../controllers/usuarioController.js';
const router = express.Router();
import checkAuth from '../middleware/checkAuth.js';

//Autenticacion, registro y confirmacion de usuarios
router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar-cuenta/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword);
//Rutas protegidas
router.get('/perfil', checkAuth, perfil);

export default router;