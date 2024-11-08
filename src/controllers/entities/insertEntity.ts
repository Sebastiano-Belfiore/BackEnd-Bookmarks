import { NextFunction, Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { Tag } from '../../core/database/models';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';
import { insertEntitiesReq } from '../../types';
import { getEntityService, insertEntityService } from '../../services/entityService';
import {
  getTagsForEntitiesService,
  getTagsForEntityService,
  getTagsService,
  getUntaggedTagService,
} from '../../services/tagService';
import { insertEntityTagsService } from '../../services/entitytagsService';

export const insertEntity = async (req: Request, res: Response, next: NextFunction) => {
  const { link, link_img, tags }: insertEntitiesReq = req.body;
  const SQLInstance = await MySQLSingleton.getInstance();

  try {
    await SQLInstance.beginTransaction();

    const entityId = await insertEntityService(link, link_img);
    let listOfTags: Tag[] = [];
    if (!tags) {
      const untaggedTag = await getUntaggedTagService();
      listOfTags = [untaggedTag];
    } else {
      listOfTags = tags;
    }

    await insertEntityTagsService(
      entityId,
      listOfTags.map((x) => x.tag_id),
    );

    const insertedEntity = await getEntityService(entityId);

    await SQLInstance.commit();

    handleResponse(res.status(HttpStatusEnum.CREATED), {
      entity: insertedEntity,
      tags: listOfTags,
    });
  } catch (error: any) {
    console.error('Error:', error);
    await SQLInstance.rollback();
    handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: error.code || -1,
      message: error.message || 'An unexpected error occurred',
    });
  }
};
