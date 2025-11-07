import Animal from "../animal.js";

class AnimalesMongoDB {
  async listar() {
    return await Animal.find();
  }

  async obtenerPorId(id) {
    return await Animal.findById(id);
  }

  async crear(data) {
    const nuevo = new Animal(data);
    return await nuevo.save();
  }

  async actualizar(id, data) {
    return await Animal.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id) {
    await Animal.findByIdAndDelete(id);
    return { mensaje: "Eliminado!" };
  }
}

export default AnimalesMongoDB;
