import mongoose from "mongoose";
import bcrypt from 'bcrypt';
//documentacion de los esquemas de mongoose
//https://mongoosejs.com/docs/guide.html

const usuarioSchema = mongoose.Schema({
    nombre : {
        type: String,
        required: true,
        trim: true //quita los espacios en blanco del inicio y final
    },
    password : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    token : {
        type: String,
    },
    confirmado : {
        type: Boolean,
        default: false
    }

},{
    timestamps: true //crea dos campos de fecha, uno de creacion y otro de actualizacion
});
usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.compararPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;