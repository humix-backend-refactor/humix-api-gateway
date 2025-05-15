import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import logger from './config/logger'

import { proxyServices } from './config/services'

const app = express()

app.use(helmet())
app.use(cors())

proxyServices(app)

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`)
    next()
})

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(8080, () => {
    logger.info("Rodando na porta 8080")
})