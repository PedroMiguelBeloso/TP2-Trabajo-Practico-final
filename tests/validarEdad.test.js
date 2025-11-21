import { expect } from "chai";
import { validarEdad } from "../utils/validarEdad.js";

/*
  Para ejecutar las pruebas:
    1) Instalar dependencias: npm install mocha chai --save-dev
    2) Ejecutar el test: npm run testValidarEdad
*/

describe("Test de validarEdad()", () => {
  
  it("debería aceptar edades válidas entre 0 y 20", () => {
    const res = validarEdad(10);
    console.log("→ Resultado edad 10:", res);
    expect(res.valido).to.equal(true);
  });

  it("debería rechazar números menores a 0", () => {
    const res = validarEdad(-1);
    console.log("→ Resultado edad -1:", res);
    expect(res.valido).to.equal(false);
    expect(res.error).to.equal("La edad debe estar entre 0 y 20 años.");
  });

  it("debería rechazar números mayores a 20", () => {
    const res = validarEdad(30);
    console.log("→ Resultado edad 30:", res);
    expect(res.valido).to.equal(false);
  });

  it("debería rechazar valores que no sean número", () => {
    const res = validarEdad("si");
    console.log("→ Resultado edad 'si':", res);
    expect(res.valido).to.equal(false);
  });

});
