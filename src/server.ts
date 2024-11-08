console.log('Running Express js');
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { entities } from './routes/entities';
import { tags } from './routes/tags';
import { handleUnmatchedRoutes } from './middlewares/errorHandler.middlewares';
import { logger } from './core/logger/color';

const server = express();

server.use(express.json());
server.use(cors());
/*server.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug('REQUEST', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  next();
}); */
server.use('/entities', entities);
server.use('/tags', tags);

server.all('*', handleUnmatchedRoutes);

server.listen(7777, () => {
  console.log(`[SERVER] Listening on port 7777`);
});
