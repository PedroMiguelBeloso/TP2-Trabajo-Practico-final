/* Controlador de animales */
import AnimalesService from '../servicio/animalesService.js';
import UsuariosService from '../servicio/usuariosServices.js';
import { mailAdoptame } from '../servicio/nodemailer.js';
import fs from "fs";
import path from "path";

const service = new AnimalesService();
const usuariosService = new UsuariosService();

class AnimalesController {

  listar = async (req, res) => res.json(await service.listar());

  obtenerPorId = async (req, res) => {
    const { id } = req.params;
    const animal = await service.obtenerPorId(id);
    animal ? res.json(animal) : res.status(404).json({ error: 'Animal no encontrado!' });
  };

crear = async (req, res) => {
    try {
      const data = { ...req.body };
      let rutaFisicaFoto = null;
      if (req.file) {
        // Ruta para la base de datos (URL web)
        data.foto = `/uploads/animales/${req.file.filename}`;
        // Ruta fisica para adjuntar el archivo foto al mail
        rutaFisicaFoto = path.join(process.cwd(), 'uploads', 'animales', req.file.filename);
      }
      const nuevo = await service.crear(data);
      try {
        const usuarios = await usuariosService.listar();
        const usuariosConEmail = usuarios.filter(u => u && u.correo);
        if (usuariosConEmail.length > 0) {
            const fechaReal = nuevo.fechaIngreso || new Date();
            const fechaFormateada = new Date(fechaReal).toLocaleDateString('es-AR');
            const animalParaEmail = {
                ...data,
                id: nuevo._id,
                fechaIngreso: fechaFormateada,
                pathImagen: rutaFisicaFoto 
            };
            console.log("Enviando datos al mailer...", animalParaEmail);
            await mailAdoptame(animalParaEmail, usuariosConEmail);
        }
      } catch (emailError) {
        console.error("Error en envío de correos:", emailError);
      }
      res.status(201).json(nuevo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      /* Si subieron nueva foto, borramos la anterior del disco (si es que existía) */
      if (req.file) {

        /* obtener animal actual para saber si tenía foto previa */
        const actual = await service.obtenerPorId(id);

        if (actual && actual.foto) {
          /* actual foto tiene forma va a:  /uploads/animales/archivo.png  
             La concatenamos directo a la raíz del proyecto  */
          const fotoPath = path.join(process.cwd(), actual.foto);

          try {
            if (fs.existsSync(fotoPath)) {
              fs.unlinkSync(fotoPath);  /* borra la imagen previa físicamente */
            }
          } catch (e) {
            console.warn("No se pudo borrar foto previa:", e.message);
          }
        }

        /* guardamos la ruta pública de la nueva foto */
        data.foto = `/uploads/animales/${req.file.filename}`;
      }

      const actualizado = await service.actualizar(id, data);
      res.json(actualizado);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      /* obtener animal para borrar foto física si existe */
      const actual = await service.obtenerPorId(id);

      if (actual && actual.foto) {
        /* unir la ruta raíz del proyecto con el path real del archivo */
        const fotoPath = path.join(process.cwd(), actual.foto);

        try {
          if (fs.existsSync(fotoPath)) {
            fs.unlinkSync(fotoPath); /* borra la foto físicamente */
          }
        } catch (e) {
          console.warn("No se pudo borrar foto al eliminar:", e.message);
        }
      }

      const resultado = await service.eliminar(id);
      res.json(resultado);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

}

export default AnimalesController;
