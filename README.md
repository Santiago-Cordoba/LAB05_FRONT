# Frontend - Gestor de Tareas

Este proyecto es el frontend de una aplicación web para gestionar tareas. La aplicación permite a los usuarios agregar, visualizar, actualizar y eliminar tareas mediante una interfaz intuitiva. Está conectada a una API RESTful que maneja las operaciones de back-end y persistencia de los datos.

## Características

- **Agregar Tareas**: Permite agregar una nueva tarea con nombre y descripción.
- **Visualizar Tareas**: Muestra una lista de tareas creadas con sus respectivos estados.
- **Actualizar Tareas**: Se puede cambiar el nombre, la descripción o el estado de una tarea existente.
- **Eliminar Tareas**: Permite eliminar una tarea de la lista.

## Tecnologías Utilizadas

- **HTML5**: Estructura básica de la página.
- **CSS3**: Para el diseño y estilos de la interfaz de usuario.
- **JavaScript (Vanilla)**: Para la manipulación del DOM y la interacción con la API REST.
- **Bootstrap**: Para el diseño responsivo y componentes de UI.

## Requisitos Previos

Para ejecutar este proyecto localmente, asegúrate de tener instalado:

- **Node.js** y **npm**: Para gestionar dependencias y ejecutar un servidor local si es necesario.
- **Git**: Para clonar este repositorio.

## Estructura del Proyecto

- **index.html**: El archivo principal que contiene la estructura HTML de la aplicación.
- **style.css**: Archivo que contiene los estilos para la aplicación.
- **app.js**: Archivo JavaScript que gestiona la lógica de la aplicación y la interacción con la API REST.
- **actualizar.png**: Imagen utilizada para representar el botón de actualización de una tarea.

## Uso

- **Agregar Tarea**: Llena el formulario con el nombre y la descripción de la tarea y haz clic en "Agregar".
- **Actualizar Tarea**: Haz clic en el botón de actualización (ícono de lápiz), modifica los detalles de la tarea y guarda los cambios.
- **Eliminar Tarea**: Haz clic en el botón de borrar (ícono de papelera) para eliminar la tarea.
- **Cambiar Estado**: Haz clic en el botón de estado para cambiar entre completado y no completado.

## Conexión con el Backend

El frontend está diseñado para interactuar con un backend desarrollado en Spring Boot que proporciona una API REST para el manejo de las tareas. Asegúrate de que el backend esté ejecutándose en el puerto `8080` para que la conexión funcione correctamente.
