const express = require('express');
const cors = require('cors'); // Importar cors
require('dotenv').config();

// Importar rutas y conexión a la DB
const connectDB = require('./src/config/database');
const routes = require('./src/routes/routes'); 

const app = express();
app.use(express.json());
// Usar CORS
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
// Rutas
app.use('/api', routes);

// Configuración del servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Conexión a la base de datos
connectDB();
