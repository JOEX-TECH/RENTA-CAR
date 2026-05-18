const pool = require('../config/db');

const crearNuevaReserva = async (req, res) => {
    const { usuario_id, vehiculo_id, fecha_inicio, fecha_fin } = req.body;

    try {
        // 1. Validar que las fechas sean congruentes
        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);
        
        if (inicio >= fin) {
            return res.status(400).json({ success: false, error: 'La fecha de fin debe ser posterior a la de inicio.' });
        }

        // 2. Calcular la cantidad de días de alquiler
        const diferenciaTiempo = fin.getTime() - inicio.getTime();
        const diasAlquiler = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        // 3. Buscar el vehículo para verificar precio y disponibilidad
        const vehiculoRes = await pool.query('SELECT precio_por_dia, estado FROM vehiculos WHERE id = $1', [vehiculo_id]);
        if (vehiculoRes.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'El vehículo seleccionado no existe.' });
        }

        const vehiculo = vehiculoRes.rows[0];
        if (vehiculo.estado !== 'disponible') {
            return res.status(400).json({ success: false, error: 'El vehículo no está disponible para estas fechas.' });
        }

        // 4. Verificar si se cruza con otra reserva activa (Double Booking Control)
        const conflictoQuery = `
            SELECT id FROM reservas 
            WHERE vehiculo_id = $1 
            AND estado_reserva = 'activa'
            AND (fecha_inicio, fecha_fin) OVERLAPS ($2::DATE, $3::DATE)
        `;
        const conflictoRes = await pool.query(conflictoQuery, [vehiculo_id, fecha_inicio, fecha_fin]);
        if (conflictoRes.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'Lo sentimos, este vehículo ya tiene una reserva activa en ese rango de fechas.' });
        }

        // 5. Calcular costos financieros
        const precioDia = parseFloat(vehiculo.precio_por_dia);
        const valorTotal = precioDia * diasAlquiler;
        
        // El depósito de garantía suele ser un valor fijo o un porcentaje (Ej: 20% del valor o mínimo 2.000.000 COP)
        const depositoGarantia = 2000000.00; 

        // 6. Simular respuesta exitosa de la pasarela de pagos (Wompi Token Validation)
        // En un paso futuro aquí conectamos el API Key que configuramos en el .env
        const estadoPago = 'autorizado'; // Pasarela aprueba y congela fondos de garantía

        // 7. Insertar la reserva en la Base de Datos
        const insertarQuery = `
            INSERT INTO reservas (usuario_id, vehiculo_id, fecha_inicio, fecha_fin, valor_total, deposito_garantia, estado_pago)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const nuevaReserva = await pool.query(insertarQuery, [
            usuario_id, vehiculo_id, fecha_inicio, fecha_fin, valorTotal, depositoGarantia, estadoPago
        ]);

        // 8. Actualizar temporalmente el estado del vehículo a 'rentado'
        await pool.query("UPDATE vehiculos SET estado = 'rentado' WHERE id = $1", [vehiculo_id]);

        res.status(201).json({
            success: true,
            message: 'Reserva procesada y pago autorizado correctamente.',
            data: nuevaReserva.rows[0]
        });

    } catch (error) {
        console.error('Error en crearNuevaReserva:', error.message);
        res.status(500).json({ success: false, error: 'Error interno en el servidor al procesar el pago y la reserva.' });
    }
};

module.exports = {
    crearNuevaReserva
};
