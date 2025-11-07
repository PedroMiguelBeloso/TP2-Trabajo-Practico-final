import Usuario from "../usuario.js";

class UsuariosMongoDB {
  async listar() {
    return await Usuario.find();
  }

  async obtenerPorId(id) {
    return await Usuario.findById(id);
  }

  async crear(data) {
    const nuevo = new Usuario(data);
    return await nuevo.save();
  }

  async actualizar(id, data) {
    return await Usuario.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id) {
    await Usuario.findByIdAndDelete(id);
    return { mensaje: "Eliminado!" };
  }
}

export default UsuariosMongoDB;
