const fs = require('fs')
const {v4: uuidv4} = require('uuid')
const express = require('express')
const axios = require('axios')

const app = express()
const randomString = uuidv4()
const TIMESTAMP_FILE = '/data/timestamp.txt'


app.get('/status', async (req, res) => {
    try {
        const pingpongUrl = 'http://pingpong-svc:3000/count'

        const {data} = await axios.get(pingpongUrl)
        const pingCount = data.count || 0

        const currentTimestamp = fs.readFileSync(TIMESTAMP_FILE, 'utf8').trim()
        const output = `${currentTimestamp}: ${randomString}\nPing / Pongs: ${pingCount}`
        res.send(output)
    } catch (err) {
        console.error('Error calling Ping-pong:', err.message)
        res.status(500).send('Error fetching ping count')
    }
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})
