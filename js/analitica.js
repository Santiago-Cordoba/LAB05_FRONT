let ctx = document.getElementById('grafico').getContext('2d');
let grafico = null; // Inicializa grafico a null

async function obtenerDatosGrafico(tipo) {
    let datos;
    try {
        const response = await fetch("https://apptareas-f5gxfjabgwfxe2ed.canadacentral-01.azurewebsites.net/tareas");
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        datos = await response.json();
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return null;
    }
    return datos;
}

async function mostrarGrafico(tipo) {
    if (grafico && grafico instanceof Chart) {
        grafico.destroy(); 
    }

    const datos = await obtenerDatosGrafico(tipo);
    if (!datos) return; 

    switch (tipo) {
        case 'histogramaDificultad':
            
            const tareasPorDificultad = {
                alto: 0,
                medio: 0,
                bajo: 0
            };

            datos.forEach(tarea => {
                if (tarea.dificultad === 'Alto') {
                    tareasPorDificultad.alto++;
                } else if (tarea.dificultad === 'Medio') {
                    tareasPorDificultad.medio++;
                } else if (tarea.dificultad === 'Bajo') {
                    tareasPorDificultad.bajo++;
                }
            });

            
            grafico = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Alto', 'Medio', 'Bajo'],
                    datasets: [{
                        label: 'Número de Tareas',
                        data: [tareasPorDificultad.alto, tareasPorDificultad.medio, tareasPorDificultad.bajo],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            break;
            case 'tareasFinalizadas':
    
            // Inicializa los contadores de tareas para cada rango de duración
            const tareasPorDuracion = [0, 0, 0, 0]; 
        
            datos.forEach(tarea => {
                const duracion = tarea.tiempoPromedio; // Asumiendo que 'duracion' es la propiedad de duración de la tarea
                
                // Clasifica las tareas según su duración
                if (duracion <= 5) {
                    tareasPorDuracion[0]++;  // 0-5 días
                } else if (duracion <= 10) {
                    tareasPorDuracion[1]++;  // 6-10 días
                } else if (duracion <= 15) {
                    tareasPorDuracion[2]++;  // 11-15 días
                } else {
                    tareasPorDuracion[3]++;  // Más de 15 días
                }
            });
        
            // Configuración del gráfico con rangos de duración
            grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['0-5 días', '6-10 días', '11-15 días', 'Más de 15 días'],  // Etiquetas según la duración
                    datasets: [{
                        label: 'Tareas Finalizadas',
                        data: tareasPorDuracion,  // Datos basados en la duración
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }]
                }
            });
            break;
        

        case 'promediosPrioridad':
            
            const tareasPorPrioridad = [0, 0, 0, 0, 0]; 

            datos.forEach(tarea => {
                const prioridad = tarea.prioridad; 
                if (prioridad >= 1 && prioridad <= 5) {
                    tareasPorPrioridad[prioridad - 1]++;
                }
            });

            
            grafico = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Prioridad 1', 'Prioridad 2', 'Prioridad 3', 'Prioridad 4', 'Prioridad 5'],
                    datasets: [{
                        label: 'Promedio de Tareas',
                        data: tareasPorPrioridad,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                        ]
                    }]
                }
            });
            break;

            case 'tiempoInvertido':
                const tareasDificultad = {
                    alto: 0,
                    medio: 0,
                    bajo: 0
                };
    
                datos.forEach(tarea => {
                    if (tarea.dificultad === 'Alto') {
                        tareasDificultad.alto+= tarea.tiempoPromedio;
                    } else if (tarea.dificultad === 'Medio') {
                        tareasDificultad.medio+= tarea.tiempoPromedio;
                    } else if (tarea.dificultad === 'Bajo') {
                        tareasDificultad.bajo+= tarea.tiempoPromedio;
                    }
                });
    
                
                grafico = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Alto', 'Medio', 'Bajo'],
                        datasets: [{
                            label: 'Número de Tareas',
                            data: [tareasDificultad.alto, tareasDificultad.medio, tareasDificultad.bajo],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                });
                break;
            
            

        default:
            console.error("Tipo de gráfico no soportado");
            break;
    }
}
