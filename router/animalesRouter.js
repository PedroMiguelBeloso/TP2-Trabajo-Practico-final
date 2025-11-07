import { Router } from 'express';
import AnimalesController from '../controlador/animalesController.js';

const router = Router();
const controller = new AnimalesController();

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export default router;
