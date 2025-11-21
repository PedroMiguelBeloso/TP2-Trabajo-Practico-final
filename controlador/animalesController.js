/* Controlador de animales */
import AnimalesService from "../servicio/animalesService.js";
import UsuariosService from "../servicio/usuariosServices.js";
import { mailAdoptame } from "../servicio/nodemailer.js";
import fs from "fs";
import path from "path";
import { validarEdad } from "../utils/validarEdad.js";

const service = new AnimalesService();
const usuariosService = new UsuariosService();

class AnimalesController {
  listar = async (req, res) => res.json(await service.listar());

  obtenerPorId = async (req, res) => {
    const { id } = req.params;
    const animal = await service.obtenerPorId(id);
    animal
      ? res.json(animal)
      : res.status(404).json({ error: "Animal no encontrado!" });
  };

  crear = async (req, res) => {
    try {
      const data = { ...req.body };

      /* llamamos a la funcion validarEdad */
      const resultadoEdad = validarEdad(Number(data.edad));
      if (!resultadoEdad.valido) {
        return res.status(400).json({ error: resultadoEdad.error });
      }

      let rutaFisicaFoto = null;

      if (req.file) {
        data.foto = `/uploads/animales/${req.file.filename}`;
        rutaFisicaFoto = path.join(
          process.cwd(),
          "uploads",
          "animales",
          req.file.filename
        );
      }

      const nuevo = await service.crear(data);

      try {
        const usuarios = await usuariosService.listar();
        const usuariosConEmail = usuarios.filter((u) => u && u.correo);
        if (usuariosConEmail.length > 0) {
          const fechaReal = nuevo.fechaIngreso || new Date();
          const fechaFormateada = new Date(fechaReal).toLocaleDateString(
            "es-AR"
          );
          const animalParaEmail = {
            ...data,
            id: nuevo._id,
            fechaIngreso: fechaFormateada,
            pathImagen: rutaFisicaFoto,
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

      /* llamamos a la funcion validarEdad */
      if (data.edad !== undefined) {
        const resultadoEdad = validarEdad(Number(data.edad));
        if (!resultadoEdad.valido) {
          return res.status(400).json({ error: resultadoEdad.error });
        }
      }

      // Si subieron nueva foto
      if (req.file) {
        const actual = await service.obtenerPorId(id);

        if (actual && actual.foto) {
          const fotoPath = path.join(process.cwd(), actual.foto);
          try {
            if (fs.existsSync(fotoPath)) {
              fs.unlinkSync(fotoPath);
            }
          } catch (e) {
            console.warn("No se pudo borrar foto previa:", e.message);
          }
        }

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

      const actual = await service.obtenerPorId(id);

      if (actual && actual.foto) {
        const fotoPath = path.join(process.cwd(), actual.foto);

        try {
          if (fs.existsSync(fotoPath)) {
            fs.unlinkSync(fotoPath);
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
