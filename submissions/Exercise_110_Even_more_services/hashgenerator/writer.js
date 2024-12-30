const fs = require('fs')
const path = '/shared/timestamp.txt'

function writeTimestamp() {
    const timestamp = new Date().toISOString()
    try {
        fs.writeFileSync(path, timestamp)
        console.log(`Writer wrote new timestamp: ${timestamp}`)
    } catch (err) {
        console.error('Error writing timestamp:', err)
    }
}

setInterval(writeTimestamp, 5000)

writeTimestamp()
