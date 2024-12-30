const express = require('express')
const {Pool} = require('pg')
const app = express()
app.use(express.json())


const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
})

const initDb = async () => {
    // language=SQL format=false
    pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      );
`).catch(err => console.error('Error creating table:', err))
}


app.get('/backend/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Failed to fetch todos')
    }
})

app.post('/backend/todos', async (req, res) => {
    try {
        const {text} = req.body
        const result = await pool.query(
            `INSERT INTO todos (text)
             VALUES ($1) RETURNING *`,
            [text]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Failed to create todo')
    }
})


const port = process.env.PORT || 3000
app.listen(port, async () => {
    console.log(`Server started in port ${port}`)
    try {
        await initDb()
        console.log('DB init complete')
    } catch (err) {
        console.error('Error during DB init:', err)
    }
})
