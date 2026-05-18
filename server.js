const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas modulares
const rutasVehiculos = require('./src/rutas/vehiculos');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conectar los endpoints de la API
app.use('/api/vehiculos', rutasVehiculos);

// Ruta de diagnóstico del sistema
app.get('/', (req, res) => {
    res.json({ 
        status: "online", 
        message: "Servidor Core de Renta Car Premium funcionando correctamente." 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
