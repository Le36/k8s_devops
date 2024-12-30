const axios = require('axios')

const createDailyTodo = async () => {
    try {
        const randomResp = await axios.get('https://en.wikipedia.org/wiki/Special:Random', {
            maxRedirects: 0,
            validateStatus: (status) => status >= 300 && status < 400
        })

        const randomArticleURL = randomResp.headers.location
            ? randomResp.headers.location : 'https://en.wikipedia.org/wiki/Special:Random'

        console.log('Got URL:', randomArticleURL)

        const backendUrl = process.env.BACKEND_URL
        const newTodo = {
            text: `Read ${randomArticleURL}`,
            done: false
        }

        const postResp = await axios.post(`${backendUrl}/backend/todos`, newTodo, {
            headers: {'Content-Type': 'application/json'}
        })

        console.log('Created:', postResp.data)
    } catch (err) {
        console.error('Error:', err)
    }
}

createDailyTodo()
