const fs = require('fs')
const express = require('express')

const app = express()
const PING_FILE = '/data/pingcount.txt'

function readPingCount() {
    if (!fs.existsSync(PING_FILE)) {
        return 0
    }
    const contents = fs.readFileSync(PING_FILE, 'utf8')
    return parseInt(contents, 10) || 0
}

function writePingCount(count) {
    fs.writeFileSync(PING_FILE, count.toString(), 'utf8')
}

app.get('/pingpong', (req, res) => {
    let currentCount = readPingCount()
    currentCount++
    writePingCount(currentCount)
    res.send(`pong ${currentCount}`)
})

app.listen(3000, () => {
    console.log('App running on port 3000')
})
