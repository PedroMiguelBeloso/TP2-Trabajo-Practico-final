import { Router } from 'express';
import UsuariosController from '../controlador/UsuariosController.js';

const router = Router();
const controller = new UsuariosController();

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;
