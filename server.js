const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor vive
app.get('/', (req, res) => {
    res.json({ 
        status: "online", 
        message: "Servidor Core de Renta Car Premium funcionando correctamente." 
    });
});

// Configuración del puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
