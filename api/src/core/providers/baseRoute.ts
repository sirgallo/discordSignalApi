import { Router } from 'express'

export class BaseRoute {
  router: Router
  constructor(private rootpath: string) {
    this.router = Router()
  }
}