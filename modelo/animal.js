import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especie: { type: String, required: true },
  edad: { type: Number, required: true },
  raza: { type: String, required: true },
  vacunado: { type: Boolean, required: true },
  adoptado: { type: Boolean, default: false },
  fechaIngreso: { type: Date, default: Date.now },
  foto: String
});

export default mongoose.model("Animal", AnimalSchema);