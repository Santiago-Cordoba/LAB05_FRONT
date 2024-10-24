const apiUrl = 'https://apptareas-f5gxfjabgwfxe2ed.canadacentral-01.azurewebsites.net/tareas';
let currentTareaId = null;

// Obtener todas las tareas cuando cargue la pagina
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTareas();

    document.getElementById('addTask').addEventListener('click', async () => {
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;

        if (taskName && taskDescription) {
            const nuevaTarea = { nombre: taskName, descripcion: taskDescription, estado: false };
            await crearTarea(nuevaTarea);
            await cargarTareas();
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
        } else {
            alert('Por favor, completa ambos campos.');
        }
    });

    document.getElementById('updateTask').addEventListener('click', async () => {
        await actualizarTarea(currentTareaId);
    });

    document.getElementById('cancelUpdate').addEventListener('click', () => {
        ocultarFormulario();
    });
});

// Cargar tareas desde la API
async function cargarTareas() {
    const tareas = await obtenerTareas();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tareas.forEach((tarea, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
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
                <button type="button" class="btn btn-info" onclick="prepararActualizacion('${tarea.id}', '${tarea.nombre}', '${tarea.descripcion}')">
                    <img src="actualizar.png" alt="Actualizar">
                </button>
            </td>
        `;
        taskList.appendChild(newRow);
    });
}

// Obtener tareas desde la API
async function obtenerTareas() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error al obtener tareas');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
}

// Crear nueva tarea
async function crearTarea(tarea) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea)
        });
        if (!response.ok) throw new Error('Error al crear tarea');
        return await response.json();
    } catch (error) {
        console.error('Error al crear tarea:', error);
    }
}

// Cambiar estado de una tarea
async function cambiarEstado(tareaId) {
    try {
        const response = await fetch(`${apiUrl}/cambio/${tareaId}`, { method: 'GET' });
        if (!response.ok) throw new Error('Error al cambiar estado');
        await cargarTareas();
    } catch (error) {
        console.error('Error al cambiar estado de tarea:', error);
    }
}

// Eliminar tarea
async function eliminarTarea(tareaId) {
    try {
        const response = await fetch(`${apiUrl}/${tareaId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar tarea');
        await cargarTareas();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

// Preparar el formulario de actualización
function prepararActualizacion(tareaId, nombre, descripcion) {
    currentTareaId = tareaId;
    document.getElementById('updateTaskName').value = nombre;
    document.getElementById('updateTaskDescription').value = descripcion;
    document.getElementById('updateForm').style.display = 'block';
}

// Ocultar formulario de actualización
function ocultarFormulario() {
    document.getElementById('updateForm').style.display = 'none';
    currentTareaId = null;
}

// Actualizar tarea
async function actualizarTarea(tareaId) {
    const taskName = document.getElementById('updateTaskName').value;
    const taskDescription = document.getElementById('updateTaskDescription').value;
    if (taskName && taskDescription) {
        const tareaActualizada = { nombre: taskName, descripcion: taskDescription, estado: false };
        try {
            const response = await fetch(`${apiUrl}/${tareaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tareaActualizada)
            });
            if (!response.ok) throw new Error('Error al actualizar tarea');
            await cargarTareas();
            ocultarFormulario();
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    } else {
        alert('Por favor, completa ambos campos.');
    }
}