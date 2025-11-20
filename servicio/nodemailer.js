import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Plantilla para UNA sola mascota
const generarHtmlMascota = (mascota) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
            <h1>¡Nuevo Amiguito en Adopción! </h1>
        </div>
        <div style="padding: 20px;">
            
            ${
              mascota.pathImagen
                ? '<img src="cid:fotoMascota" width="300" style="display:block; margin: 0 auto; border-radius: 8px;" />'
                : ""
            }
            
            <h2 style="text-align: center;">Conoce a ${mascota.nombre}</h2>
            <h4 style="text-align: center;">${mascota.especie}</h4>
            <p><strong>Raza:</strong> ${mascota.raza}</p>
            <p><strong>Edad:</strong> ${mascota.edad}</p>
            <p><strong>Vacunado:</strong> ${mascota.vacunado ? `Si` : `No`}</p>
            <p><strong>Fecha de ingreso:</strong> ${mascota.fechaIngreso}</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:${process.env.PORT || 8080}/animal.html?id=${mascota.id}"
                   style="background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   ¡Quiero Adoptarlo!
                </a>
            </div>
        </div>
    </div>
    `;
};

export const mailAdoptame = async (mascota, listaUsuarios) => {
  try {
    const htmlContent = generarHtmlMascota(mascota);

    // Adjuntar imagen si existe
    const attachments = [];
    if (mascota.pathImagen) {
      attachments.push({
        filename: `${mascota.nombre}.jpg`,
        path: mascota.pathImagen,
        cid: "fotoMascota",
      });
    }

    // Enviar correos
    const envios = listaUsuarios.map((usuario) => {
      return transporter.sendMail({
        from: `"Adóptame App" <${process.env.EMAIL_USER}>`,
        to: usuario.correo,
        subject: `¡Conoce a ${mascota.nombre}! Busca hogar`,
        html: htmlContent,
        attachments: attachments,
      });
    });

    const resultados = await Promise.allSettled(envios);
    console.log(resultados);

    const exitosos = resultados.filter((r) => r.status === "fulfilled").length;
    console.log(
      `Difusión completada. Enviados: ${exitosos}/${listaUsuarios.length}`
    );

    return { enviados: exitosos, total: listaUsuarios.length };
  } catch (error) {
    console.error("Error en mailAdoptame:", error);
    throw error;
  }
};
