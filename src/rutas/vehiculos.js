const express = require('express');
const router = express.Router();
const { obtenerFlotaDisponible } = require('../controladoras/vehiculos');

// Definir la ruta que consultará el Frontend
router.get('/disponibles', obtenerFlotaDisponible);

module.exports = router;
