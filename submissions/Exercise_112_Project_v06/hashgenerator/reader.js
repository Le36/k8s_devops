const fs = require('fs')
const {v4: uuidv4} = require('uuid')
const express = require('express')

const app = express()
const randomString = uuidv4()
const TIMESTAMP_FILE = '/data/timestamp.txt'
const PINGCOUNT_FILE = '/data/pingcount.txt'


const hash = () => {
    let timestamp = 'No timestamp found'
    let pingCount = 0

    if (fs.existsSync(TIMESTAMP_FILE)) {
        timestamp = fs.readFileSync(TIMESTAMP_FILE, 'utf8').trim()
    }

    if (fs.existsSync(PINGCOUNT_FILE)) {
        pingCount = parseInt(fs.readFileSync(PINGCOUNT_FILE, 'utf8'), 10) || 0
    }

    return `${timestamp}: ${randomString}\nPing / Pongs: ${pingCount}`
}

app.get('/status', (req, res) => {
    const output = hash()
    res.send(output)
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})

setInterval(() => {
    console.log(`Reader reading: ${hash()}`)
}, 5000)