const express = require('express')
const app = express()

let counter = 0

app.get('/pingpong', (req, res) => {
    counter++
    res.send(`pong ${counter}`)
})

app.get('/count', (req, res) => {
    res.json({count: counter})
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})
