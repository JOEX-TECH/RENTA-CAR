const express = require('express');
const router = express.Router();
const { crearNuevaReserva } = require('../controladoras/reservas');

// Endpoint para que el cliente liquide y pague su reserva
router.post('/crear', crearNuevaReserva);

module.exports = router;
