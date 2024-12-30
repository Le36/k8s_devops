const express = require('express')
const {Pool} = require('pg')

const app = express()

const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
})

async function initDb() {
    // language=SQL format=false
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ping_counter (
          id SERIAL PRIMARY KEY,
          count INT
        );
    `)

    // language=SQL format=false
    await pool.query(`
        INSERT INTO ping_counter (id, count) 
        VALUES (1, 0)
        ON CONFLICT (id) DO NOTHING;
    `)
}

app.get('/', (req, res) => {
    res.send('OK')
})

app.get('/pingpong', async (req, res) => {
    try {
        await pool.query('UPDATE ping_counter SET count = count + 1 WHERE id = 1')

        const result = await pool.query('SELECT count FROM ping_counter WHERE id = 1')
        const currentCount = result.rows[0]?.count ?? 0

        res.send(`pong ${currentCount}`)
    } catch (err) {
        console.error('Error updating/fetching ping counter:', err)
        res.status(500).send('Database error')
    }
})

app.get('/count', async (req, res) => {
    const result = await pool.query('SELECT count FROM ping_counter WHERE id = 1')
    const currentCount = result.rows[0]?.count ?? 0
    res.json({count: currentCount})
})

app.listen(3000, async () => {
    console.log('App running on port 3000')
    try {
        await initDb()
        console.log('DB init complete')
    } catch (err) {
        console.error('Error during DB init:', err)
    }
})
