// modelo/Factory.js
import config from '../config.js';
import AnimalesMem from './DAOs/animalesMem.js';
import AnimalesMongoDB from './DAOs/animalesMongoDB.js';
import UsuariosMongoDB from './DAOs/usuariosMongoDB.js';
import UsuariosMem from './DAOs/usuariosMem.js';

class Factory {
  static getPersistencias() {
    switch (config.MODO_PERSISTENCIA) {
      case 'MONGODB':
        return { animales: new AnimalesMongoDB(), usuarios: new UsuariosMongoDB() };
      default:
        return { animales: new AnimalesMem(), usuarios: new UsuariosMem() };
    }
  }
}

export default Factory;
