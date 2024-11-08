import { NextFunction, Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse } from '../../core/handler/responseHandler';
import {
  getEntityTagsForEntitiesService,
  insertEntityTagsService,
} from '../../services/entitytagsService';
import { deleteTagService, getUntaggedTagService } from '../../services/tagService';
import { EntityTags } from '../../core/database/models';

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  const tag_id: number = parseInt(req.params.tag_id, 10);
  const SQLInstance = await MySQLSingleton.getInstance();

  if (isNaN(tag_id)) {
    return handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: -1,
      message: 'Invalid tag ID provided',
    });
  }

  try {
    await SQLInstance.beginTransaction();

    await deleteTagService(tag_id);

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
