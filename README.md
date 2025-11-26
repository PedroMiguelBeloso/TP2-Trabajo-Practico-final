#  Proyecto “AppDoptame”

Docente Daniel Sanchez

 Alumnos:
 Daniel Alcazár
 Pedro Beloso
 Diego Kleiman
 
 Año 2025
 
 Curso 2°1 D

 Introducción:
 La finalidad de esta aplicación web de adopción de animales es ayudar a adoptar y
 poner en adopcion tus mascotas de manera más efectiva.
 Las funcionalidades principales son :
 
 Registro de usuarios y Registro de mascotas mediante formulario frontend
 Visualización: en el front se puede visualizar los usuarios registrados y los
 animales publicados.
 
 Edicion de datos guardados: en el front se puede editar los datos de mascotas y
 usuarios regristrados.
 
 Emailing: Al cargarse una mascota en la aplicacion (formulario en front) se envia
 un email a los usuarios registrados avisandoles que hay una nueva mascota que
 busca flia.
 
 Base URL
 http://localhost:${PORT} (8080, editable en config.js)
 
Recurso Usuarios

 Método: crear
 Crea un nuevo usuario en el sistema.
 
 Solicitud HTTP
 POST http://localhost:${PORT}/api/usuarios/crear
 
 Cuerpo de la solicitud
 Debe tener los siguientes campos necesarios para crear un nuevo usuario:
 
 {
 nombre:String
 apellido:String
 email:String  
 password:String
 fechaDeNacimiento:String 
}

 Cuerpo de respuesta
 Si se ejecuta correctamente, se crea un usuario en la base de datos.
 
Recurso Usuarios

 Método: listar
 lista los usuarios del sistema.
 
 Solicitud HTTP
 GET http://localhost:${PORT}/api/usuarios/listar
 
 Cuerpo de la respuesta
 Devuelve un Array con los objetos de los usuarios ya creados
 
 {
 id:String
 nombre:String
 apellido:String
 email:String  
 password:String
 fechaDeNacimiento:String 
}

 Cuerpo de respuesta
 Si se ejecuta correctamente, se listan los usuarios de la base de datos.
 
Recurso Animales
 Método: crear
 Crea un nuevo usuario en el sistema.
 
 Solicitud HTTP
 POST http://localhost:${PORT}/api/animales/crear
 
 Cuerpo de la solicitud
 Debe tener los siguientes campos necesarios para crear un nuevo animal:
 
 {
 nombre:String
 especie:String
 sexo:String  
 edad:int (edad >=0 && edad <=20)
 raza:String
 vacunado:Boolean
 }
 
 Cuerpo de respuesta
 Si se ejecuta correctamente, se crea un usuario en la base de datos.
 Códigos de estado
 
 Código
 200
 Estado
 Registro correcto - todo funcionó correctamente
 500
 Error interno del servidor
 
Recurso Animales
 Método: listar
 Obtiene la lista de gastos asociadas a un usuario específico.
 Solicitud HTTP
 
 GET
 http://localhost:${PORT}/api/animales
 
 Parámetros de ruta de acceso
 Cuerpo de la respuesta
 Devuelve un Array con los objetos de los animales ya creados
 
 {
 id:String
 nombre:String
 especie:String
 sexo:String  
 edad:int
 raza:String
 vacunado:Boolean
 adoptado:Boolean
 foto:String
 fechaIngreso:Date
 }
