import { NextFunction, Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { Tag, Entity, EntityReq, TagReq } from '../../core/database/models';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse, ResponseBody, ResponseData } from '../../core/handler/responseHandler';
import { logger } from '../../core/logger/color';
import { insertEntitiesReq } from '../../types';
import { getEntityService, updateEntityService } from '../../services/entityService';
import {
  deleteEntityTagsServiceByEntityId,
  insertEntityTagsService,
} from '../../services/entitytagsService';
import { getTagService, getUntaggedTagService, updateTagService } from '../../services/tagService';

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  const SQLInstance = await MySQLSingleton.getInstance();
  req.params;
  const tagReq: TagReq = req.body;
  const tag_id: number = parseInt(req.params.tag_id, 10);

  try {
    await SQLInstance.beginTransaction();

    await updateTagService(tag_id, tagReq.name, tagReq.color, tagReq.is_favorite);

    const tagUpdated = await getTagService(tag_id);
    console.log('TagUpdated', tagUpdated);
    await SQLInstance.commit();
    handleResponse(res.status(HttpStatusEnum.OK), { tag: tagUpdated });
  } catch (error: any) {
    await SQLInstance.rollback();
    console.error(error);
    handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: error.code,
      message: error.message,
    });
  }
};
