import mongoose from "mongoose";
const contectarDB = async () => {
    try {
        const conncetion = await mongoose.connect(process.env.MONGO_URIS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${conncetion.connection.host}:${conncetion.connection.port}`;
        console.log(`MongoDB conectado: ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1); //detener la app
    }
}

export default contectarDB;