// Importación de módulos usados en el proyecto
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Código que permite al servidor convertir los datos enviados por los usuarios en un formato que el servidor pueda entender 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Código para manejar sesiones
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Obtiene los archivos estáticos (HTML, CSS, JS) desde la raíz del proyecto para mostrar en el navegador
app.use(express.static(path.join(__dirname)));

// Permite leer los usuarios desde el archivo JSON
const usersFilePath = path.join(__dirname, 'users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

// Permite leer las tareas desde el archivo JSON
const tareasFilePath = path.join(__dirname, 'tareas.json');
let tareas = JSON.parse(fs.readFileSync(tareasFilePath, 'utf8'));

// Este código nos indica la ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { user, password } = req.body;

    const foundUser = users.find(u => u.user === user && u.password === password);

    if (foundUser) {
        req.session.user = foundUser.user;
        res.send('success');
    } else {
        res.send('failure');
    }
});

// Este código permite obtener las tareas del archivo tareas.json (nuestra BD).
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Este código permite agregar tareas al archivo tareas.json (nuestra BD)
app.post('/tareas', (req, res) => {
    const newTask = req.body;
    tareas.push(newTask);

    fs.writeFile(tareasFilePath, JSON.stringify(tareas, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar la tarea:', err);
            res.status(500).json({ success: false, error: 'Error al guardar la tarea' });
        } else {
            res.json({ success: true });
        }
    });
});

// Ruta para obtener detalles de una tarea específica
app.get('/tareas/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const tarea = tareas.find(t => t.codigo === codigo);

    if (tarea) {
        res.json(tarea);
    } else {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }
});

// Ruta para actualizar una tarea existente
app.put('/tareas/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const index = tareas.findIndex(t => t.codigo === codigo);

    if (index !== -1) {
        // Actualizar solo el estatus y agregar nuevo comentario
        tareas[index].estatus = req.body.estatus;

        if (req.body.nuevoComentario) {
            const fechaActual = new Date().toLocaleString();
            const nuevoComentarioConFecha = `\n[${fechaActual}] ${req.body.nuevoComentario}`;
            tareas[index].comentarios += nuevoComentarioConFecha;
        }

        fs.writeFile(tareasFilePath, JSON.stringify(tareas, null, 2), (err) => {
            if (err) {
                console.error('Error al actualizar la tarea:', err);
                res.status(500).json({ success: false, error: 'Error al actualizar la tarea' });
            } else {
                res.json({ success: true });
            }
        });
    } else {
        res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
});

// Este código nos indica la ruta para obtener el usuario en la sesión actual.
app.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Usuario no autenticado' });
    }
});

// Inicia el servidor en nuestro equipo y nos indica el puerto desde el cuál podemos acceder.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
