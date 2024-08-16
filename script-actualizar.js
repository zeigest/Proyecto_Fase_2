document.addEventListener('DOMContentLoaded', () => {
    const detalleTarea = document.getElementById('detalle-tarea');
    let lastScrollPosition = 0; //

    // Al dar doble clic, carga los datos en el formulario  de actualización
    document.querySelector('.cuerpo-tabla').addEventListener('dblclick', async (event) => {
        try {
            const row = event.target.closest('tr');
            const codigoTarea = row.children[0].textContent;

            // Guarda la posición actual del puntero en vertical
            lastScrollPosition = window.scrollY;

            // Muestra la sección de detalles cambiando el display de  None a Block
            detalleTarea.style.display = 'block';

            // Después de lo anterior, nos envía a la parte en donde se encuentra el formulario de actualización.
            detalleTarea.scrollIntoView({ behavior: 'smooth' });

            const response = await fetch(`/tareas/${codigoTarea}`);
            if (!response.ok) throw new Error('Error al obtener los detalles de la tarea');
            const tarea = await response.json();

            document.getElementById('id-tarea').value = tarea.codigo;
            document.getElementById('titulo-tarea').value = tarea.titulo;
            document.getElementById('descripcion-tarea').value = tarea.descripcion;
            document.getElementById('fecha-inicio').value = tarea.fecha_inicio;
            document.getElementById('cliente-tarea').value = tarea.nombre_cliente;
            document.getElementById('id-proyecto-tarea').value = tarea.id_proyecto;
            document.getElementById('comentarios-tarea').value = tarea.comentarios;
            document.getElementById('estatus-tarea').value = tarea.estatus;

            // Este código nos permite deshabilitar los campos que no vamos a permitir que se editen
            ['titulo-tarea', 'descripcion-tarea', 'fecha-inicio', 'cliente-tarea', 'id-proyecto-tarea', 'comentarios-tarea', 'id-tarea']
                .forEach(id => document.getElementById(id).disabled = true);
            document.getElementById('comentarios-tarea').readOnly = true;
        } catch (error) {
            console.error('Error:', error);
            window.alert('Error al cargar los detalles de la tarea.');
        }
    });

    // Si el usuario da clic en otro lugar que no sea el formulario, lo cerrará y enviará al usuario a la posición previa del puntero en vertical
    document.addEventListener('click', (event) => {
        if (detalleTarea.style.display === 'block' && !detalleTarea.contains(event.target)) {
            detalleTarea.style.display = 'none';

            window.scrollTo({ top: lastScrollPosition, behavior: 'smooth' });
        }
    });

    // Esta parte permite actualizar el registro y lanza un mensaje de éxito o error
    document.getElementById('update-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const updatedTask = {
                codigo: document.getElementById('id-tarea').value,
                estatus: document.getElementById('estatus-tarea').value,
                nuevoComentario: document.getElementById('nuevo-comentario').value
            };

            const response = await fetch(`/tareas/${updatedTask.codigo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            });

            const data = await response.json();
            if (data.success) {
                window.alert("Tarea actualizada exitosamente");
                window.location.reload();
            } else {
                throw new Error('Error al actualizar la tarea');
            }
        } catch (error) {
            console.error('Error:', error);
            window.alert('Error al actualizar la tarea.');
        }
    });

});
