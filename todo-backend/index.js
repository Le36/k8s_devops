const express = require('express')
const app = express()
app.use(express.json())

let todos = []
let currentId = 1

app.get('/backend/todos', (req, res) => {
    res.json(todos)
})

app.post('/backend/todos', (req, res) => {
    const {text} = req.body
    const newTodo = {
        id: currentId++,
        text: text || ''
    }
    todos.push(newTodo)
    res.status(201).json(newTodo)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started in port ${port}`)
})
