import { BaseServer } from './src/core/providers/baseServer'
import { pollRoute } from './src/routes/pollRoute'

const routes = [
  pollRoute
]

const server = new BaseServer(routes)
server.run(true)