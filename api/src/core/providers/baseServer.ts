const cluster = require('cluster')
const path = require('path')

import { config } from 'dotenv'
import * as os from 'os'
import * as createError from 'http-errors'
import * as express from 'express'
import { Worker } from 'cluster'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as compression from 'compression'

config({ path: '.env' })

export const normalizePort = (val: string) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
      return val
  }
  if (port >= 0) {
      return port
  }
  return false
}

export class BaseServer {
  private app: express.Application
  private port = normalizePort(process.env.PORT)
  private ip: string = os.networkInterfaces()['eth0'][0].address

  private numOfCpus: number = parseInt(process.env.CPUS) || os.cpus().length
  private name: string = process.env.NAME
  private version: string = process.env.VERSION

  private workers: Worker[] = []

  constructor(private routes: any[]) {
    this.app = express()
  }

  run(isClusterRequired: boolean) {
    this.app.set('port', this.port)

    this.app.use(logger('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(compression())

    for (const route of this.routes) {
      this.app.use(route.rootpath, route.router)
    }

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      next(createError(404))
    })

    // error handler
    this.app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.this.app.get('env') === 'development' ? err : {}
      
      res.status(err.status || 500).json({ error: err.message })
    })

    if(isClusterRequired && cluster.isPrimary) {
      this.setUpWorkers()
    } else {
      this.setUpServer()
    }
  }

  setUpServer () {
    this.app.listen(this.port, () => {
      console.log(`Server ${process.pid} listening on port ${this.port}`)
    })
  }

  setUpWorkers () {
    console.log(`Welcome to ${this.name}, version ${this.version}`)
    console.log('')
    console.log(`Server @${this.ip} setting up ${this.numOfCpus} CPUs as workers.`)
    console.log('')

    for(let cpu = 0; cpu < this.numOfCpus; cpu++) {
      this.workers.push(cluster.fork())
      
      this.workers[cpu].on('message', message => {
        console.log(message)
      })
    }

    cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online.`)
    })

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code ${code} and ${signal}.`)
      console.log('Starting new worker.')
      cluster.fork()
      this.workers.push(cluster.fork())
      this.workers[this.workers.length - 1].on('message', message => {
        console.log(message)
      })
    })
  }
}