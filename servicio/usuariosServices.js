import Factory from '../modelo/Factory.js';
const persistencia = Factory.getPersistencia();

class UsuariosService {
    listar = async () => await persistencia.listar();
    obtenerPorId = async (id) => await persistencia.obtenerPorId(id);
    crear = async (obj) => await persistencia.crear(obj);
    actualizar = async (id, obj) => await persistencia.actualizar(id, obj);
    eliminar = async (id) => await persistencia.eliminar(id);
}

export default UsuariosService;