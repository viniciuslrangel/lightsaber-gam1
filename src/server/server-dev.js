import path from 'path'
import express from 'express'
import webpack from 'webpack'
import { createServer } from 'https'
import fs from 'fs'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import entry from './src/index.js'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    res.status(404)
    res.type('txt').send('Not found')
    return
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

const server = createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)

entry(server)

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
