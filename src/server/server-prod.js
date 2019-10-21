import path from 'path'
import express from 'express'
import entry from './src'
import { createServer } from 'http'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')


app.use(express.static(DIST_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

const server = createServer(app)

entry(server)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})