document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const userField = document.getElementById('user');
                const passwordField = document.getElementById('password');

                const userValue = userField.value;
                const passwordValue = passwordField.value;

                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: userValue, password: passwordValue })
                });

                const data = await response.text();

                if (data === 'success') {
                    window.location.href = "main.html";
                } else {
                    window.alert("Usuario o contraseña incorrecto");
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
                window.alert("Ocurrió un error al intentar iniciar sesión.");
            }
        });
    }

    // Este código permite abrir la página registro-tarea cuando se da clic en el botón de la página principal para crear tareas nuevas
    const createButton = document.querySelector('.create-button');
    if (createButton) {
        createButton.addEventListener('click', () => {
            window.open('registro-tarea.html', 'Registrar Tarea', 'width=800,height=800');
        });
    }

    // Obtiene los datos escritos por el usuario y los envia al servidor al dar clic en el botón para agregar tareas nuevas, después cierra la ventana emergente y actualiza la página principal para que se muestren los registros.
    if (window.location.pathname.endsWith('registro-tarea.html')) {
        const registerForm = document.getElementById('project-form');
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const task = {
                    codigo: document.getElementById('id-tarea').value,
                    titulo: document.getElementById('titulo-tarea').value,
                    descripcion: document.getElementById('descripcion-tarea').value,
                    fecha_inicio: document.getElementById('fecha-inicio').value,
                    nombre_cliente: document.getElementById('cliente-tarea').value,
                    id_proyecto: document.getElementById('id-proyecto-tarea').value,
                    comentarios: document.getElementById('comentarios-tarea').value,
                    estatus: document.querySelector('select').value
                };

                const response = await fetch('/tareas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(task)
                });

                const data = await response.json();

                if (data.success) {
                    window.alert("Tarea agregada exitosamente");
                    window.opener.location.reload();
                    window.close();
                } else {
                    window.alert("Error al agregar la tarea");
                }
            } catch (error) {
                console.error('Error al agregar la tarea:', error);
                window.alert("Ocurrió un error al intentar agregar la tarea.");
            }
        });
    }

    // Solicita el nombre del usuario actual y actualiza el header en todas las páginas donde se coloque.
    try {
        fetch('/current-user')
            .then(response => response.json())
            .then(data => {
                const userHeader = document.getElementById('usuario-activo');
                if (userHeader && data.user) {
                    userHeader.textContent = `¡Buenos días ${data.user}!`;
                }
            })
            .catch(error => {
                console.error('Error al obtener el usuario actual:', error);
            });
    } catch (error) {
        console.error('Error al intentar obtener el usuario actual:', error);
    }

    
    // Obtiene y muestra las tareas del archivo JSON tareas y las muestra en la página principal
    if (window.location.pathname.endsWith('main.html')) {
        try {
            fetch('/tareas')
                .then(response => response.json())
                .then(tareas => {
                    console.log(tareas); 
                    const tableBody = document.querySelector('.cuerpo-tabla');

                    if (tareas.length === 0) {
                        const emptyRow = document.createElement('tr');
                        emptyRow.innerHTML = `<td colspan="8">No hay tareas disponibles</td>`;
                        tableBody.appendChild(emptyRow);
                    } else {
                        tareas.forEach(tarea => {
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
                })
                .catch(error => {
                    console.error('Error al obtener las tareas:', error);
                });
        } catch (error) {
            console.error('Error al intentar obtener las tareas:', error);
        }
    }

    // Esta parte nos permite mostrar un tooltip al lado del mouse sólo mientras el puntero se encuentre en el cuerpo de la tabla que muestra los registros

    const tooltip = document.getElementById('tooltip');
    const tableBody = document.querySelector('.tabla-tareas tbody');

    tableBody.addEventListener('mousemove', (event) => {
        const x = event.pageX + 15;
        const y = event.pageY + 15;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.style.display = 'block';
    });

    tableBody.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    tableBody.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
    });
});
