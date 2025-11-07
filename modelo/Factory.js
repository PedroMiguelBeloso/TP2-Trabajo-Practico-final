// modelo/Factory.js
import config from '../config.js';
import AnimalesMem from './DAOs/AnimalesMem.js';
import AnimalesMongoDB from './DAOs/animalesMongoDB.js';

class Factory {
  static getPersistencia() {
    switch (config.MODO_PERSISTENCIA) {
      case 'MONGODB':
        return new AnimalesMongoDB();
      default:
        return new AnimalesMem();
    }
  }
}

export default Factory;
