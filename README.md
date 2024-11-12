Clínica Online - Sistema de Gestión de Turnos y Usuarios -Matias Skenen
Descripción del Proyecto
Este sistema ha sido desarrollado para cubrir las necesidades de la Clínica OnLine, la cual se especializa en salud y cuenta con consultorios, laboratorios y una sala de espera general.
A través de este sistema, los pacientes pueden solicitar turnos con profesionales de diversas especialidades, quienes tienen la capacidad de administrar sus horarios y especialidades. Además, el sistema permite gestionar usuarios (Pacientes, Especialistas y Administradores), así como la visualización y gestión de turnos.

Características Generales
Registro de Usuarios: Pacientes, Especialistas y Administradores.
Gestión de Turnos: Solicitud, cancelación, aceptación y finalización de turnos.
Perfiles de Usuario: Visualización de datos personales y la gestión de horarios en el caso de los Especialistas.
Historia Clínica: Registro y visualización de las atenciones realizadas a los pacientes.
Captcha: Verificación de captcha en el registro y operaciones críticas.
Transiciones Animadas: Navegación con animaciones entre componentes.

Pacientes:
Nombre, Apellido, Edad, DNI, Obra Social, Email, Contraseña, Imágenes de perfil.

Especialistas:
Nombre, Apellido, Edad, DNI, Especialidad (pueden tener más de una), Email, Contraseña, Imagen de perfil.
Validación: Todos los campos se validan adecuadamente y los Especialistas deben ser aprobados por un Administrador antes de poder ingresar al sistema.

3. Login de Usuarios
Acceso al sistema mediante Email y Contraseña. Los perfiles de Especialistas deben estar aprobados y ambos (Pacientes y Especialistas) deben verificar su Email.

4. Gestión de Usuarios (Solo Administrador)
El Administrador puede:

Ver información detallada de los usuarios.
Habilitar/Inhabilitar Especialistas.
Crear nuevos usuarios, incluidos Administradores.

5. Gestión de Turnos
Pacientes
Mis Turnos: Los pacientes pueden visualizar los turnos que solicitaron, filtrarlos por Especialidad y Especialista, y realizar las siguientes acciones:
Cancelar Turno: Si el turno no ha sido realizado.
Ver Reseña: Si hay una reseña cargada.
Completar Encuesta: Si el turno fue realizado.
Calificar Atención: Si el turno fue completado.

Especialistas
Mis Turnos: Los especialistas pueden visualizar los turnos asignados, filtrarlos por Especialidad y Paciente, y realizar las siguientes acciones:
Aceptar/Rechazar Turno.
Finalizar Turno: Con la posibilidad de cargar una reseña y diagnóstico.
Administrador
Turnos: El Administrador puede gestionar todos los turnos de la clínica, filtrarlos y cancelarlos si es necesario.
7. Solicitar Turno
Disponible tanto para Pacientes como para el Administrador. Los pacientes seleccionan la especialidad, especialista, y el horario disponible dentro de los próximos 15 días.

8. Mi Perfil
Cada usuario puede ver y editar sus datos personales. Los Especialistas pueden además gestionar su disponibilidad horaria y especialidades.

