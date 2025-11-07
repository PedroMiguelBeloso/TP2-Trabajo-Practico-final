# Propuesta-N-1-Tp2-App-De-Adopci-n-de-mascotas-

Que es: Una app que permite presentar a usuarios mascotas para adoptar.

Qué hace: gestion completa de animales disponibles para adopción, crea postulaciones,registra usuarios, realizar adopciones,permite realizar estadísticas(sacar promedios podria ser en base a la totalidad de adoptados) y exportaciones. Con backend Node/mysql (adaptando a las sugerencias del profesor mongodb/ mongodb atlas).

Entidades/Models principales
Usuario (id, nombre, email, passwordHash, rol(si es adoptante o publicante/ de ultima podemos hacer que cualquiera de los dos publique si asi lo desea))

Animal (id, nombre, especie, raza, edad, sexo, descripcion, estado (disponible/adoptado), fotos)

Postulacion (id, usuarioId, animalId, mensaje, estado (pendiente/aceptada/rechazada), fecha)

Adopcion (id, usuarioId, animalId, fechaAdopcion, notas)

HistorialClinicoAnimal (id, animalId, vacunado, desparasitacion, observaciones)

Endpoints (ejemplos):
POST /usuario/registro, POST /usuario/login

GET /animal, GET /animal/id, POST /animal, PUT /animal/id, DELETE /animal/id

POST /animal/id/postulacion

GET /postulacion get/postulacion/Id get/pustalacion/estado (filtrarlas por estado o id)

POST /animal/id/export = exporta todos los animales te da su nombre y estado #2

Ejemplo de Sql:
Usuario(id PK, nombre, email UNIQUE, password, rol);

Animal(id PK, nombre, especie, raza, edad, sexo, descripcion, estado);

Postulacion(id PK, usuarioId FK, animalId FK, mensaje, estado, fecha);

Adopcion(id PK, usuarioId FK, animalId FK, fechaAdopcion, notas);

funciones compleja/moderada:
confirmacion de mail a la hora de crear usuarios nuevos, es decir, los usuarios tendrian que entrar a su mail y validar que son ellos los que se registran.

generador de estadisticas ya sea en bd o archivo externo que muestre los animales adoptados por mes o por animal.

exportador te de el listado de mascotas publicadas y te diga su estado (disponible/adoptado) #2

en ambos casos tomarias informacion y la transformas en una nueva.

Preferencias--- El usuario tiene preferencias y la app le recomienda en base a las mismas (ver si es factible hacerlo), de ser posible usuario deberia tener preferencias y las mismas deberian conectar con las mascotas, por ejemplo busca animales de hasta 5 años, que le muestre todos los animales que tengan hasta 5 años.

GET /preferencias/:usuarioId seria el Endpoint

## Sugerencias de alta-doderada complejidad del profesor:
-  SUBIR al servicio una foto se considera de alta complejidad
-  Guardar imágenes npm MULTER
-  El servidor pueda mandar sms, whatsapp, email se considera de alta complejidad
-  Creación de archivos de export, por ej que se genere el archivo y que se pueda enviar por mail por ej (con esto queda check lo que pide el tp)
-  Consumir una api
-  Que el canal tenga un canal de chat (websocket) npm SOCKET.IO
-  Configurar un chatbot por ej
-  Notificaciones al mail del tipo newsletter con las mascotas disponibles

Caso de uso 4 dos de baja y dos de alta complejidad
