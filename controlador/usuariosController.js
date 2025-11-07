import UsuariosService from '../servicio/usuariosServices.js';
const service = new UsuariosService();

class UsuariosController {
    listar = async (req, res) => res.json(await service.listar());

    obtenerPorId = async (req, res) => {
        const { id } = req.params;
        const user = await service.obtenerPorId(id);
        user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado!' });
    };

    crear = async (req, res) => {
        const nuevo = await service.crear(req.body);
        res.status(201).json(nuevo);
    };

    actualizar = async (req, res) => {
        const { id } = req.params;
        const actualizado = await service.actualizar(id, req.body);
        res.json(actualizado);
    };

    eliminar = async (req, res) => {
        const { id } = req.params;
        const resultado = await service.eliminar(id);
        res.json(resultado);
    };
    }

export default UsuariosController;