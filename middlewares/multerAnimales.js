/* middlewares/multerAnimales.js */

/* Aca lo que trate de hacer es crear un middleware para subir imágenes de animales, este mismo
se encarga de manejar la subida de archivos, guardarlos en el servidor
(en este caso la db guarda la ruta de la img)
y agregar la informacion a la
request para que el controlador (animalesControllers) pueda almacenarlo en la base de datos. */

/* explicacion:
el usuario va a realizar un put o un update, este middelware va a capturar y
 chequear el tipo de archivo y datos de esa accion este bien
y lo va a mandar al controller (animalesController) */
/* En caso de no subir una imagen, te va a tirar error y no va a cumplir la peticion. */

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "animales");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + ext; /* toma la imagen y le genera un numero unico basado en la hora  */
    cb(null, name);
  },
});

/* la linea 28 a 33 lo que hace es el chequeo de la imagen,
que tamaño tiene, si realmente hay una imagen y donde se guarda. */
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) cb(null, true);
  else cb(new Error("Sólo archivos de imagen permitidos (jpg, jpeg, png)"));
};

/* si todo esta corriendo bien la linea 36 a 40 lo guarda. */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

export default upload;
