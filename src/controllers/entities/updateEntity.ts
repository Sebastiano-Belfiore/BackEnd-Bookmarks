import { NextFunction, Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { Tag, EntityReq } from '../../core/database/models';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse } from '../../core/handler/responseHandler';
import { getEntityService, updateEntityService } from '../../services/entityService';
import {
  deleteEntityTagsServiceByEntityId,
  insertEntityTagsService,
} from '../../services/entitytagsService';
import { getTagsForEntityService } from '../../services/tagService';

export const updateEntity = async (req: Request, res: Response, next: NextFunction) => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const entity: EntityReq = req.body;
  const entity_id: number = parseInt(req.params.entity_id, 10);

  try {
    await SQLInstance.beginTransaction();

    await updateEntityService(entity_id, entity.link, entity.link_img);

    const currentTags: Tag[] = await getTagsForEntityService(entity_id);

    const newTags: Tag[] = entity.tags || [];

    const currentTagIds = currentTags.map((tag) => tag.tag_id);
    const newTagIds = newTags.map((tag) => tag.tag_id);

    const tagsToRetain = currentTags.filter((tag) => newTagIds.includes(tag.tag_id));
    const tagsToAdd = newTags.filter((tag) => !currentTagIds.includes(tag.tag_id));
    const tagsToRemove = currentTags.filter((tag) => !newTagIds.includes(tag.tag_id));

    if (tagsToAdd.length > 0) {
      await insertEntityTagsService(
        entity_id,
        tagsToAdd.map((tag) => tag.tag_id),
      );
    }

    if (tagsToRemove.length > 0) {
      await deleteEntityTagsServiceByEntityId(
        entity_id,
        tagsToRemove.map((tag) => tag.tag_id),
      );
    }

    const entityUpdated = await getEntityService(entity_id);
    await SQLInstance.commit();

    handleResponse(res.status(HttpStatusEnum.OK), {
      entity: entityUpdated,
      tags: [...tagsToRetain, ...tagsToAdd],
    });
  } catch (error: any) {
    await SQLInstance.rollback();
    console.error(error);
    handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: error.code,
      message: error.message,
    });
  }
};
