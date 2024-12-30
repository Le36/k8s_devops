const express = require('express')
const {Pool} = require('pg')
const app = express()
const morgan = require('morgan')
const {connect, StringCodec} = require('nats')
app.use(express.json())
app.use(morgan('combined'))

const NATS_URL = process.env.NATS_URL
const sc = StringCodec()

let natsConnection;

(async () => {
    try {
        natsConnection = await connect({servers: NATS_URL})
        console.log(`todo-backend connected to NATS at ${NATS_URL}`)
    } catch (err) {
        console.error('Failed to connect to NATS:', err)
    }
})()

const publishEvent = eventPayload => {
    if (!natsConnection) {
        console.warn('NATS not connected yet; cannot publish event')
        return
    }
    natsConnection.publish('events', sc.encode(JSON.stringify(eventPayload)))
}

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
        text VARCHAR(255) NOT NULL,
        done BOOLEAN NOT NULL DEFAULT false
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

        if (!text || text.trim().length === 0) {
            console.log('Empty todo text')
            return res.status(400).send('Todo text is required')
        }

        if (text.length > 140) {
            console.log(`Todo text too long: "${text}"`)
            return res.status(400).send('Todo text cannot exceed 140 characters')
        }

        console.log(`Creating todo with text: "${text}"`)

        const result = await pool.query(
            `INSERT INTO todos (text)
             VALUES ($1) RETURNING *`,
            [text]
        )
        publishEvent({type: 'created', todo: text})
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('Failed to create todo:', err)
        res.status(500).send('Failed to create todo')
    }
})

app.put('/backend/todos/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {done} = req.body

        if (typeof done !== 'boolean') {
            return res.status(400).send('Invalid done value')
        }

        const result = await pool.query(
            `UPDATE todos
             SET done = $1
             WHERE id = $2 RETURNING *`,
            [done, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).send('Todo not found')
        }

        publishEvent({type: 'marked', todo: id})
        res.json(result.rows[0])
    } catch (err) {
        console.error('Failed to update todo:', err)
        res.status(500).send('Failed to update todo')
    }
})

app.get('/ready', async (req, res) => {
    try {
        await pool.query('SELECT 1')
        return res.sendStatus(200)
    } catch (err) {
        console.error('Readiness check failed:', err)
        return res.sendStatus(500)
    }
})

app.get('/', (req, res) => {
    res.send('OK')
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
