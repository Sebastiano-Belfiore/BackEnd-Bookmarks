import { Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';

export const getRecentUsage = async (req: Request, res: Response) => {
  const query = `
    SELECT 
        tags.tag_id, 
        tags.name, 
        tags.color, 
        tags.is_favorite, 
        tags.updated_at, 
        tags.created_at, 
        MAX(entitytags.created_at) AS last_used 
    FROM tags 
    JOIN entitytags ON entitytags.tag_id = tags.tag_id 
    GROUP BY tags.tag_id 
    ORDER BY last_used DESC
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
          value: row.last_used,
        }))
      : [];

    handleResponse(res.status(HttpStatusEnum.OK), { tags: formattedResult });
  } catch (error: any) {
    console.error('Error fetching recent usage:', error);
    handleResponse(res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR));
  }
};
