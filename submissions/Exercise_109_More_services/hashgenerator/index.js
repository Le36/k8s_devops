const express = require('express')
const {v4: uuidv4} = require('uuid')

const app = express()

const randomString = uuidv4()
let latestTimestamp = new Date().toISOString()

setInterval(() => {
    latestTimestamp = new Date().toISOString()
    console.log(`${latestTimestamp}: ${randomString}`)
}, 5000)

app.get('/status', (req, res) => {
    res.json({
        randomString,
        timestamp: latestTimestamp
    })
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})
