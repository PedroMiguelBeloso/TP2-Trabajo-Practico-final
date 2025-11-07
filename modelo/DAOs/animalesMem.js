class AnimalesMem {
  constructor() {
    this.animales = [];
  }

  async listar() {
    return this.animales;
  }

  async obtenerPorId(id) {
    return this.animales.find(a => a.id == id);
  }

  async crear(obj) {
    const id = String(this.animales.length + 1);
    const nuevo = { id, ...obj };
    this.animales.push(nuevo);
    return nuevo;
  }

  async actualizar(id, obj) {
    const index = this.animales.findIndex(a => a.id == id);
    if (index === -1) return null;
    this.animales[index] = { id, ...obj };
    return this.animales[index];
  }

  async eliminar(id) {
    this.animales = this.animales.filter(a => a.id != id);
    return { mensaje: 'Eliminado correctamente' };
  }
}

export default AnimalesMem;
