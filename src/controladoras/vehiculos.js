const pool = require('../config/db');

// Función para obtener todos los autos disponibles
const obtenerFlotaDisponible = async (req, res) => {
    try {
        const query = `
            SELECT id, marca, modelo, año, placa, precio_por_dia, estado, imagen_url, caracteristicas 
            FROM vehiculos 
            WHERE estado = 'disponible' 
            ORDER BY precio_por_dia DESC
        `;
        const resultado = await pool.query(query);
        
        res.status(200).json({
            success: true,
            count: resultado.rows.length,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error en obtenerFlotaDisponible:', error.message);
        res.status(500).json({
            success: false,
            error: 'Error interno en el servidor al cargar la flota de vehículos.'
        });
    }
};

module.exports = {
    obtenerFlotaDisponible
};
