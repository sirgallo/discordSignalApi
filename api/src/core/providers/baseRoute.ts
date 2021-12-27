import { Router } from 'express'

export class BaseRoute {
  router: Router = Router()
  constructor(private rootpath: string) {}
}