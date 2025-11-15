import express from "express";
import AnimalesController from "../controlador/animalesController.js";
import upload from "../middlewares/multerAnimales.js";   

const router = express.Router();
const controller = new AnimalesController();

router.get("/", controller.listar);
router.get("/:id", controller.obtenerPorId);

/* Crear animal con foto */ 
router.post("/", upload.single("foto"), controller.crear);

/*  Actualizar animal con foto opcional */
router.put("/:id", upload.single("foto"), controller.actualizar);

router.delete("/:id", controller.eliminar);

export default router;
