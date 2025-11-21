/* Funcion para validar la edad por tipo de dato y rango de edad */
export function validarEdad(edad) {
  
  /* Validación de tipo */
  if (typeof edad !== "number" || isNaN(edad)) {
    return { valido: false, error: "La edad debe ser un número válido." };
  }

  /* Validación de rango */
  if (edad < 0 || edad > 20) {
    return { valido: false, error: "La edad debe estar entre 0 y 20 años." };
  }

  /*Si todo está bien */
  return { valido: true };
}
