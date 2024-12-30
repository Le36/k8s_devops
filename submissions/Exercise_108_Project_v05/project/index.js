const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello k8s')
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`)
})
