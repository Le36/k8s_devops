const express = require('express')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000

const IMAGE_DIR = '/data'
const IMAGE_FILENAME = 'picsum.jpg'
const IMAGE_PATH = path.join(IMAGE_DIR, IMAGE_FILENAME)
const ONE_HOUR = 3600000

const getFileAgeInMilliseconds = filePath => {
    try {
        const stats = fs.statSync(filePath)
        const now = Date.now()
        const fileTime = new Date(stats.mtime).getTime()
        return now - fileTime
    } catch (err) {
        return Infinity
    }
}

app.get('/image', async (req, res) => {
    try {
        const fileAge = getFileAgeInMilliseconds(IMAGE_PATH)
        const minutesLeft = Math.max(0, Math.floor((ONE_HOUR - fileAge) / 60000))

        if (fileAge > ONE_HOUR) {
            console.log('Fetching new image...')
            const response = await axios.get('https://picsum.photos/1200', {
                responseType: 'arraybuffer'
            })

            fs.writeFileSync(IMAGE_PATH, response.data)
            console.log('New image saved.')
        } else {
            console.log(`Minutes left on img: ${minutesLeft}`)
        }

        res.sendFile(IMAGE_PATH)
    } catch (err) {
        console.error('Error serving image:', err)
        res.status(500).send('Error fetching/serving image')
    }
})

app.get('/', (req, res) => {
    res.send(`
    <h1>Welcome to the ToDo App!</h1>
    <img src="/image" alt="Random Image" style="max-width: 30%; height: auto;" />
    <br />
    <input type="text" id="todoInput" maxlength="140" placeholder="Enter your TODO..." />
    <button id="addTodo">Create TODO</button>
    <ul>
      <li>TODO 1</li>
      <li>TODO 2</li>
    </ul>
    <script>
      document.getElementById('addTodo').addEventListener('click', () => {
          const input = document.getElementById('todoInput');
          if (input.value.length > 0 && input.value.length <= 140) {
              alert('TODO Added: ' + input.value);
              input.value = '';
          } else {
              alert('TODO must be between 1 and 140 characters.');
          }
      });
    </script>
  `)
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`)
})
