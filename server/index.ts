import compression from 'compression'
import path from 'path'
import serverTiming from 'server-timing'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import { proxy } from './middlewares/proxy'
import { render } from './middlewares/renderer'


// we'll talk about this in a minute:
const PORT = 8001

// initialize the application and create the routes
const app = express()
const router = express.Router()

app.use(morgan('dev'))
app.use(bodyParser.json())

// root (/) should always serve our server rendered page
router.use('^/$', render)

router.use('/_v/:scope/graphql/v1', proxy)

// other static resources should just be served as they are
router.use(
  express.static(
    path.resolve(__dirname, '../build'),
    { maxAge: '30d' },
  )
)

// tell the app to use the above rules
app.use(compression())
app.use(serverTiming({
  total: true,
  enabled: true,
  autoEnd: true,
}))
app.use(router)

// start the app
app.listen(PORT, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  console.log(`Server is listening on http://localhost:${PORT} 🦄`)
})