class UsuariosMem {
  constructor() {
    this.usuarios = [];
  }

  async listar() {
    return this.usuarios;
  }

  async obtenerPorId(id) {
    return this.usuarios.find(u => u.id == id);
  }

  async crear(obj) {
    const id = String(this.usuarios.length + 1);
    const nuevo = { id, ...obj };
    this.usuarios.push(nuevo);
    return nuevo;
  }

  async actualizar(id, obj) {
    const index = this.usuarios.findIndex(u => u.id == id);
    if (index === -1) return null;
    this.usuarios[index] = { id, ...obj };
    return this.usuarios[index];
  }

  async eliminar(id) {
    this.usuarios = this.usuarios.filter(u => u.id != id);
    return { mensaje: 'Eliminado correctamente' };
  }
}

export default UsuariosMem;