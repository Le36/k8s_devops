const {connect, StringCodec} = require('nats')
const axios = require('axios')

const NATS_URL = process.env.NATS_URL
const CHAT_WEBHOOK_URL = process.env.CHAT_WEBHOOK_URL
const SUBJECT = process.env.NATS_SUBJECT

const sc = StringCodec();

(async () => {
    try {
        const nc = await connect({servers: NATS_URL})
        console.log(`broadcaster connected to NATS at ${NATS_URL}`)

        const sub = nc.subscribe(SUBJECT, {queue: 'broadcaster-group'})

        for await (const m of sub) {
            const raw = sc.decode(m.data)
            const event = JSON.parse(raw)

            console.log(`Received event:`, event)

            let messageText = ''
            if (event.type === 'created') {
                messageText = `A new todo was created (text: ${event.todo}).`
            } else if (event.type === 'marked') {
                messageText = `Todo (id: ${event.todo}) was marked done`
            } else {
                messageText = `Unknown event type: ${event.type}`
            }

            await sendToChatApp(messageText)
        }

        console.log(`Subscription to ${SUBJECT} closed`)
    } catch (err) {
        console.error('Failed to connect or subscribe to NATS:', err)
    }
})()

const sendToChatApp = async message => {
    console.log('Sending message to chat app:', message)
    try {
        const payload = {
            user: 'bot',
            message: message
        }
        const response = await axios.post(CHAT_WEBHOOK_URL, payload, {timeout: 5000})
        console.log('Chat app response:', response.data)
    } catch (err) {
        console.error('Failed to post message to chat app:', err)
    }
}
