const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();  // Para usar las variables de entorno
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Para parsear las solicitudes JSON

// Crear la conexión a la base de datos MySQL usando la URL proporcionada por Heroku
const db = mysql.createConnection(process.env.JAWSDB_URL);

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Ruta de la API para obtener los datos desde la base de datos
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, result) => {
    if (err) {
      console.error('Database query error:', err);  // Log de error con más detalles
      res.status(500).send('Database error');
    } else {
      console.log('Database query result:', result);  // Log del resultado de la consulta
      res.json(result);
    }
  });
});

// Enviar los archivos estáticos de React solo cuando estemos en producción
if (process.env.NODE_ENV === 'production') {
  // Sirve los archivos estáticos de React desde la carpeta build
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Redirige todas las rutas no definidas a la aplicación React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
