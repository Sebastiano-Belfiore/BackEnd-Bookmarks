import { Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';

export const getUsageCount = async (req: Request, res: Response) => {
  const query = `
  SELECT 
    tags.tag_id, 
    tags.name, 
    tags.color, 
    tags.is_favorite, 
    tags.created_at, 
    tags.updated_at, 
    COUNT(entitytags.entity_id) AS usage_count
  FROM tags
  JOIN entitytags ON tags.tag_id = entitytags.tag_id
  GROUP BY tags.tag_id, tags.name
  ORDER BY usage_count DESC;
`;

  const SQLInstance = await MySQLSingleton.getInstance();

  try {
    const result = await SQLInstance.query(query);
    const formattedResult = result
      ? result.map((row: any) => ({
          tag: {
            tag_id: row.tag_id,
            name: row.name,
            color: row.color,
            is_favorite: row.is_favorite,
            updated_at: row.updated_at,
            created_at: row.created_at,
          },
          value: row.usage_count,
        }))
      : [];
    handleResponse(res.status(HttpStatusEnum.OK), { tags: formattedResult });
  } catch (error: any) {
    handleResponse(res.status(HttpStatusEnum.OK));
  }
};
