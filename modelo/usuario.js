import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    password: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
   // rol: { type: String, default: "Usuario" },
});

export default mongoose.model("Usuario", UsuarioSchema);