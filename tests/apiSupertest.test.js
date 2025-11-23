import { expect } from "chai";
import supertest from "supertest";
import app from "../server.js";
import mongoose from "mongoose";


/* 1) instalar en la consola: npm install supertest --save-dev */
/* 2) ejecutar en consola: npm run testSuper */

const request = supertest(app);

describe("SUPERTEST - Pruebas de API Adopciones", function () {

    before(async () => {
        /*  Conectar a la base de datos antes de las pruebas */
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }
    });

    after(async () => {
        /* cierra la conexion */
        await mongoose.connection.close();
    });

    it("GET /api/animales → debería devolver una lista y status 200", async () => {
        const response = await request.get("/api/animales");
        console.log("GET animales:", response.status, response.body);
        expect(response.status).to.equal(200);/* si pasa por aca y va bien, mocha lo tilda como aprobado. */
        /* Si el estatus es 200 quiere decir que esta bien  */
        /* Esto retorna una lista de animales registrados */
    });

    it("POST /api/usuarios → debería crear un usuario", async () => {
        const usuario = {
            nombre: "Test",
            apellido: "Supertest",
            correo: "test@example.com",
            password: "12345678",
            fechaNacimiento: "2000-01-01"
        };

        const response = await request.post("/api/usuarios").send(usuario);
        console.log("POST usuarios:", response.status, response.body);

        expect(response.status).to.equal(201);/* si pasa por aca y va bien, mocha lo tilda como aprobado. */
        /* Chequea que el estatus sea 201 lo cual esta bien */
        /* Esto indica que el usuario fue creado exitosamente en la db */
    });

});
