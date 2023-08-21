//anteriormente para importar un archivo se usaba require en nodejs, porque no se soportaba import
//pero ahora se puede usar import
//las sintaxis para no import se llamaba commonjs
//ejemplo de como se usaba require
/*const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('Server on port 400000000000000000');
});*/
//para utilizar los imports a esta forma se le llama modulos de es6
//debemos agregar en el package.json "type": "module"
//en node el import de archivos locales requiere la extension, sin extension es para dependencias
import express from 'express';
import dotenv from "dotenv";
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

//Configuracion de cors
//cors te permite hacer peticiones desde otro dominio
//si no se configura cors no se puede hacer peticiones desde otro dominio
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) {
            //puede consultar la api
            callback(null, true);
        } else {
            //no puede consultar la api
            callback(new Error('No permitido por CORS'));
        }
    },
}

app.use(cors(corsOptions));

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

//socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', (socket) => {
    console.log('Conectado al socket.io');
    //Definir los eventos de socket.io
    socket.on('abrir-proyecto', id => {
        socket.join(id);
    });
    socket.on('nueva-tarea', tarea => {
        socket.to(tarea.proyecto).emit('agregar-tarea', tarea);
    });
    socket.on('tarea-eliminada', tarea => {
        socket.to(tarea.proyecto).emit('eliminar-tarea', tarea);
    });
    socket.on('tarea-editada', tarea => {
        socket.to(tarea.proyecto._id).emit('editar-tarea', tarea);
    });
    socket.on('tarea-estado', tarea => {
        socket.to(tarea.proyecto._id).emit('estado-tarea', tarea);
    });
});