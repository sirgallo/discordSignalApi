import { Request, Response, NextFunction } from 'express'
import { BaseRoute } from '../core/providers/baseRoute'

class Poll extends BaseRoute {
  constructor(rootpath: string) {
    super(rootpath)
    this.router.get('/', this.poll)
  }

  poll(req: Request, res: Response, next: NextFunction) {
    res
      .status(200)
      .send({ alive: 'okay' })
  }
}

export const pollRoute = new Poll('/poll')