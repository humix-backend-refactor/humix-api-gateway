import dotenv from 'dotenv'
dotenv.config()

import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'

import logger from './config/logger'

const app = express()

app.use(helmet())
app.use(cors())

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`)
})

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(8080, () => {
    logger.info("Rodando na porta 8080")
})