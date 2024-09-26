const apiUrl = 'http://localhost:8080/tareas';

// Obtener todas las tareas cuando cargue la página
document.addEventListener('DOMContentLoaded', getTareas);

function getTareas() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            console.log('Respuesta completa:', response); // Para verificar qué está recibiendo
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Limpiar la lista antes de agregar
            data.forEach((tarea, index) => {
                taskList.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${tarea.nombre}</td>
                        <td>${tarea.descripcion}</td>
                        <td class="btn-container">
                            <button type="button" class="btn ${tarea.estado ? 'btn-success' : 'btn-warning'}" onclick="cambiarEstado('${tarea.id}')">
                                ${tarea.estado ? 'Hecho' : 'No Hecho'}
                            </button>
                        </td>
                        <td class="btn-container">
                            <button type="button" class="btn btn-danger" onclick="eliminarTarea('${tarea.id}')">X</button>
                        </td>
                        <td class="btn-container">
                            <button type="button" class="btn btn-info" onclick="actualizarTarea('${tarea.id}')">
                                <img src="actualizar.png" alt="Actualizar">
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Agregar una nueva tarea
document.getElementById('addTask').addEventListener('click', () => {
    const nombreTarea = document.getElementById('nombreTarea').value;
    const descripcionTarea = document.getElementById('descripcionTarea').value;

    if (nombreTarea && descripcionTarea) {
        const nuevaTarea = {
            nombre: nombreTarea,
            descripcion: descripcionTarea,
            estado: false
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaTarea)
        })
        .then(response => response.json())
        .then(() => {
            getTareas(); // Actualizar la lista de tareas
            document.getElementById('nombreTarea').value = '';
            document.getElementById('descripcionTarea').value = '';
        })
        .catch(error => console.error('Error:', error));
    }
});

// Cambiar el estado de una tarea
function cambiarEstado(tareaId) {
    fetch(`${apiUrl}/cambio/${tareaId}`, {
        method: 'GET'
    })
    .then(() => getTareas())
    .catch(error => console.error('Error:', error));
}

// Eliminar una tarea
function eliminarTarea(tareaId) {
    fetch(`${apiUrl}/${tareaId}`, {
        method: 'DELETE'
    })
    .then(() => getTareas())
    .catch(error => console.error('Error:', error));
}

// Actualizar una tarea
function actualizarTarea(tareaId) {
    const nombreTarea = prompt('Ingrese el nuevo nombre de la tarea:');
    const descripcionTarea = prompt('Ingrese la nueva descripción de la tarea:');

    if (nombreTarea && descripcionTarea) {
        const tareaActualizada = {
            nombre: nombreTarea,
            descripcion: descripcionTarea,
            estado: false
        };

        fetch(`${apiUrl}/${tareaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tareaActualizada)
        })
        .then(() => getTareas())
        .catch(error => console.error('Error:', error));
    }
}