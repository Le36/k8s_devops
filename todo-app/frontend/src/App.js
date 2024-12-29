import React, {useEffect, useState} from 'react'

function App() {
    const [todos, setTodos] = useState([])
    const [todoText, setTodoText] = useState('')

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const res = await fetch('/backend/todos')
            const data = await res.json()
            setTodos(data)
        } catch (err) {
            console.error('Failed to fetch todos:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!todoText.trim() || todoText.length > 140) return

        try {
            await fetch('/backend/todos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: todoText})
            })

            setTodoText('')
            await fetchTodos()
        } catch (err) {
            console.error('Failed to add todo:', err)
        }
    }

    const handleMarkDone = async (id) => {
        try {
            await fetch(`/backend/todos/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({done: true})
            })
            await fetchTodos()
        } catch (err) {
            console.error('Failed to mark todo as done:', err)
        }
    }

    return (
        <div style={{margin: '2rem'}}>
            <h1>Todo App</h1>

            <div>
                <img
                    src="/image"
                    style={{maxWidth: '400px', marginBottom: '1rem', display: 'block'}}
                />
            </div>

            <form onSubmit={handleSubmit} style={{display: 'flex', gap: '0.5rem'}}>
                <input
                    type="text"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    style={{flex: 1}}
                    maxLength={140}
                />
                <button type="submit">Add Todo</button>
            </form>

            <ul style={{marginTop: '1rem'}}>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.text} {todo.done ? '(DONE)' : '(NOT DONE)'}
                        <button onClick={() => handleMarkDone(todo.id)}>Mark Done</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App