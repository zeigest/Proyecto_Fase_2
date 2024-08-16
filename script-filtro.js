document.addEventListener('DOMContentLoaded', () => {
    const filtroEstatus = document.getElementById('filtro-estatus');
    const tableBody = document.querySelector('.cuerpo-tabla');

    // Esta función permite cargar las tareas en la tabla según el filtro
    const cargarTareas = async (estatusFiltro) => {
        try {
            const response = await fetch('/tareas');
            if (!response.ok) throw new Error('Error al obtener las tareas');
            const tareas = await response.json();

            tableBody.innerHTML = ''; 

            const tareasFiltradas = estatusFiltro === 'Todos' 
                ? tareas 
                : tareas.filter(tarea => tarea.estatus === estatusFiltro);

            if (tareasFiltradas.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `<td colspan="8">No hay tareas disponibles</td>`;
                tableBody.appendChild(emptyRow);
            } else {
                tareasFiltradas.forEach(tarea => {
                    const row = document.createElement('tr');
                    row.classList.add('contenido-tabla');
                    row.innerHTML = `
                        <td>${tarea.codigo}</td>
                        <td>${tarea.titulo}</td>
                        <td>${tarea.descripcion}</td>
                        <td>${tarea.fecha_inicio}</td>
                        <td>${tarea.nombre_cliente}</td>
                        <td>${tarea.id_proyecto}</td>
                        <td>${tarea.comentarios}</td>
                        <td>${tarea.estatus}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            window.alert('Error al cargar las tareas.');
        }
    };

    // Esta parte nos permite controlar el evento de cambio en el filtro para recargar la tabla
    filtroEstatus.addEventListener('change', () => {
        const estatusSeleccionado = filtroEstatus.value;
        cargarTareas(estatusSeleccionado);
    });

    // Al inicio, carga las tareas.
    cargarTareas('Todos');
});
