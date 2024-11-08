import { Request, Response } from 'express';
import { HttpStatusEnum } from '../core/enums/httpcodes';
import { handleResponse } from '../core/handler/responseHandler';
import { logger } from '../core/logger/color';

export const handleUnmatchedRoutes = async (req: Request, res: Response) => {
  handleResponse(res.status(HttpStatusEnum.NOT_FOUND), null, {
    code: HttpStatusEnum.NOT_FOUND,
    message: 'unexpected-route',
  });
};
