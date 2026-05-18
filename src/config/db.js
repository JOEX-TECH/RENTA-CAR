const { Pool } = require('pg');
require('dotenv').config();

// Creamos un pool de conexiones usando la URL secreta del entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Esto evita caídas si la base de datos está en un servidor externo como Render o AWS
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('🔌 Conexión establecida con la base de datos PostgreSQL.');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el cliente de la base de datos:', err);
});

module.exports = pool;
