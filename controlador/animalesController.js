import AnimalesService from '../servicio/animalesService.js';
const service = new AnimalesService();

class AnimalesController {
  listar = async (req, res) => res.json(await service.listar());

  obtenerPorId = async (req, res) => {
    const { id } = req.params;
    const animal = await service.obtenerPorId(id);
    animal ? res.json(animal) : res.status(404).json({ error: 'Animal no encontrado!' });
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

export default AnimalesController;
