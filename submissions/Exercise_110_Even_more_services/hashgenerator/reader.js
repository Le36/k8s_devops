const fs = require('fs')
const {v4: uuidv4} = require('uuid')
const express = require('express')

const app = express()
const randomString = uuidv4()
const path = '/shared/timestamp.txt'

const hash = () => {
    let data = 'No timestamp found'

    try {
        if (fs.existsSync(path)) {
            const timestamp = fs.readFileSync(path, 'utf8')
            data = `${timestamp}: ${randomString}`
        }
    } catch (err) {
        console.error('Error reading file:', err)
    }
    return data
}

app.get('/status', (req, res) => {
    let data = hash()

    res.send(data)
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})

setInterval(() => {
    console.log(`${hash()}`)
}, 5000)