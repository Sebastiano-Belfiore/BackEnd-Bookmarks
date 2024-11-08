import { Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { Entity, EntityTags, Tag } from '../../core/database/models';
import { SearchFilter } from '../../types';
import { getTagsForEntitiesService } from '../../services/tagService';

export const getEntitiesByTags = async (req: Request, res: Response) => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const includeTags: Tag[] = req.body.includeTags;
  const excludeTags: Tag[] = req.body.excludeTags;
  const includeTagFilter: SearchFilter = req.body.includeTagFilter;

  const getEntities = async (): Promise<Entity[]> => {
    let result: Entity[] = [];
    if (includeTags) {
      const placeholders = includeTags.map(() => '?').join(', ');
      const query_include =
        includeTagFilter === 'ALL'
          ? `
            SELECT 
                entities.entity_id, 
                entities.link,
                entities.link_img,
                entities.created_at,
                entities.updated_at
            FROM entities
            JOIN entitytags ON entitytags.entity_id = entities.entity_id
            JOIN tags ON entitytags.tag_id = tags.tag_id
            GROUP BY 
                entities.entity_id 
            HAVING 
                COUNT(DISTINCT tags.tag_id) = ${includeTags.length} AND 
                SUM(tags.tag_id IN (${placeholders})) = ${includeTags.length};
        `
          : `
            SELECT 
                entities.entity_id, 
                entities.link,
                entities.link_img,
                entities.created_at,
                entities.updated_at
            FROM entities
            JOIN entitytags ON entitytags.entity_id = entities.entity_id
            JOIN tags ON entitytags.tag_id = tags.tag_id
            WHERE tags.tag_id IN (${placeholders})
            GROUP BY 
                entities.entity_id;
        `;

      try {
        const resultQuery: Entity[] = await SQLInstance.query(
          query_include,
          includeTags.map((tag) => tag.tag_id),
        );
        result = resultQuery;
      } catch (error: any) {
        console.error('Error executing query:', error);
        const e: Error = { ...error };
        throw new Error('Error executing query:' + e);
      }
    }
    if (excludeTags) {
      const query_exclude = result
        ? `
      SELECT 
          entities.entity_id,
          entities.link,
          entities.link_img,
          entities.craeted_at,
          entities.updated_at
      FROM entities 
      JOIN entitytags ON entitytags.entity_id = entities.entity_id 
      JOIN tags ON entitytags.tag_id = tags.tag_id 
      WHERE entities.entity_id IN (${result.map(() => '?').join(', ')})
      AND entitytags.tag_id NOT IN (${excludeTags.map(() => '?').join(', ')})
      GROUP BY 
          entities.entity_id;
      `
        : `SELECT 
        entities.entity_id,
        entities.link,
        entities.link_img,
        entities.created_at,
        entities.updated_at,
      FROM entities 
      JOIN entitytags ON entitytags.entity_id = entities.entity_id 
      WHERE entitytags.tag_id NOT IN ${excludeTags.map(() => '?').join(', ')}
      GROUP BY 
        entities.entity_id `;

      try {
        const resultQuery: Entity[] = await SQLInstance.query(
          query_exclude,
          includeTags
            ? [result.map((entity) => entity.entity_id), excludeTags.map((tag) => tag.tag_id)]
            : excludeTags.map((tag) => tag.tag_id),
        );
        result = resultQuery;
      } catch (error: any) {
        console.error('Error executing query:', error);
        const e: Error = { ...error };
        throw new Error('Error executing query:' + e);
      }
    }
    return result;
  };

  if (!includeTags && !excludeTags) {
    return handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, {
      code: -4,
      message: 'No Tag selected',
    });
  }
  try {
    const entitiesResult: Entity[] = await getEntities();
    const tagsMap = await getTagsForEntitiesService(entitiesResult);

    const response = entitiesResult.map((entity) => ({
      ...entity,
      tags: tagsMap[entity.entity_id] || [],
    }));

    return handleResponse(res.status(HttpStatusEnum.OK), { entities: response });
  } catch (e: any) {
    return handleResponse(res.status(HttpStatusEnum.BAD_REQUEST), null, e);
  }
};
