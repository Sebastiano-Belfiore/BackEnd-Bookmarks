import { Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { Entity } from '../../core/database/models';
import { getAllEntitiesService } from '../../services/entityService';
import { getTagsForEntitiesService } from '../../services/tagService';

export const getAllEntities = async (req: Request, res: Response) => {
  try {
    const entitiesResult: Entity[] = await getAllEntitiesService();
    const tagsMap = await getTagsForEntitiesService(entitiesResult);

    const response = entitiesResult.map((entity) => ({
      ...entity,
      tags: tagsMap[entity.entity_id] || [],
    }));

    handleResponse(res.status(HttpStatusEnum.OK), { entities: response });
  } catch (e: any) {
    console.error('Error querying database:', e);
    handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, e);
  }
};
