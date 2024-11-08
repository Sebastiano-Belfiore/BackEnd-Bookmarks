import { NextFunction, Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse } from '../../core/handler/responseHandler';
import { deleteEntityTagsServiceByEntityId } from '../../services/entitytagsService';
import { deleteEntityService } from '../../services/entityService';

export const deleteEntity = async (req: Request, res: Response, next: NextFunction) => {
  const entity_id: number = parseInt(req.params.entity_id, 10);
  const SQLInstance = await MySQLSingleton.getInstance();

  if (isNaN(entity_id)) {
    return handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: -1,
      message: 'Invalid entity ID provided',
    });
  }
  try {
    await SQLInstance.beginTransaction();

    await deleteEntityService(entity_id);
    await SQLInstance.commit();

    handleResponse(res.status(HttpStatusEnum.OK));
  } catch (error: any) {
    console.error('Error:', error);
    await SQLInstance.rollback();
    handleResponse(res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR), null, {
      code: error.code || -1,
      message: error.message || 'An unexpected error occurred',
    });
  }
};
