// Importa el módulo MySQL para interactuar con la base de datos MySQL
const mysql = require('mysql');
// Importa la biblioteca bcrypt para el cifrado de contraseñas
const bcrypt = require('bcrypt');
// Importa el módulo path para manejar rutas de archivos y directorios
const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');
// Crea una instancia de la aplicación Express
const app = express();
// Establece el puerto en el que el servidor escuchará las solicitudes
const port = 3000;

// Crea una conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cosmeticos1'
});

// Establece la conexión a la base de datos MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

app.use(express.json());
// Configura el middleware bodyParser para analizar datos de solicitud codificados en URL
app.use(bodyParser.urlencoded({ extended: true }));
// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Define la ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Define la ruta para la página de nosotros
app.get('/nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'nosotros', 'nosotros.html'));
});
// Define la ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

// Define la ruta para la página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register', 'registro.html'));
});

// Maneja las solicitudes POST para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuario WHERE username = ?';
    // Realiza una consulta a la base de datos para obtener el usuario con el nombre de usuario proporcionado
    db.query(query, [username], (err, result) => {
        if (err) {
            throw err;
        }
        // Verifica si se encontró un usuario con el nombre de usuario proporcionado
        if (result.length > 0) {
            const hashedPassword = result[0].password;
            // Compara la contraseña proporcionada con la contraseña almacenada usando bcrypt
            bcrypt.compare(password, hashedPassword, (err, bcryptResult) => {
                if (bcryptResult) {
                    // Si las contraseñas coinciden, devuelve un objeto JSON con exists: true
                    res.json({ exists: true, id: result[0].id, fullName: result[0].name });
                } else {
                    // Si las contraseñas no coinciden, devuelve un objeto JSON con exists: false
                    res.json({ exists: false });
                }
            });
        } else {
            // Si no se encuentra ningún usuario, devuelve un objeto JSON con exists: false
            res.json({ exists: false });
        }
    });
});

// Maneja las solicitudes POST para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el nombre de usuario ya existe
        const checkUserQuery = 'SELECT username FROM usuario WHERE username = ?';
        db.query(checkUserQuery, [username], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al verificar el usuario' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
            }

            // Si el usuario no existe, proceder con el registro
            bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error(hashErr);
                    return res.status(500).json({ message: 'Error al encriptar la contraseña' });
                }

                const insertUserQuery = 'INSERT INTO usuario (name, username, password) VALUES (?, ?, ?)';
                db.query(insertUserQuery, [name, username, hashedPassword], (insertErr, results) => {
                    if (insertErr) {
                        console.error(insertErr);
                        return res.status(500).json({ message: 'Error al registrar el usuario' });
                    }

                    res.status(200).json({ message: 'Usuario registrado exitosamente' });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Maneja las solicitudes PUT para actualizar nombre y contraseña de usuario
app.put('/updateUser', async (req, res) => {
    const { username, password, id } = req.body;    

    console.log(req.body);

    console.log(username);
    console.log(password);
    console.log(id);

if (!username || !password || !id) {
    return res.status(400).json({ message: `Todos los campos son obligatorios` });
}

try {
    // Verificar si el id de usuario existe
    const checkUserQuery = 'SELECT username FROM usuario WHERE id = ?';
    db.query(checkUserQuery, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al verificar el usuario' });
        }

        if (results.length < 0) {
            return res.status(400).json({ message: 'El usuario no existe' });
        }

        // Si el usuario no existe, proceder con el registro
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error(hashErr);
                return res.status(500).json({ message: 'Error al encriptar la contraseña' });
            }

            const insertUserQuery = 'UPDATE usuario SET NAME = ?, PASSWORD = ? WHERE id = ?';
            db.query(insertUserQuery, [username, hashedPassword, id], (insertErr, results) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).json({ message: 'Error al actualizar el usuario' });
                }

                res.status(200).json({ message: 'Usuario actualizado exitosamente' });
            });
        });
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
}
});

// Define la ruta para la página de inicio después del inicio de sesión
app.get('/home', (req, res) => {
    // Aquí puedes enviar el archivo home.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define una nueva ruta para cerrar sesión
app.get('/logout', (req, res) => {
    // Realiza cualquier tarea de cierre de sesión necesaria y redirige al usuario a la página de inicio de sesión
    res.redirect('/login');
});


// Escucha las solicitudes en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});