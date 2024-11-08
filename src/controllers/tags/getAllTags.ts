import { Request, Response } from 'express';
import { Tag } from '../../core/database/models';
import { MySQLSingleton } from '../../core/database/mysql';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { getTagsService } from '../../services/tagService';
export const getAllTags = async (req: Request, res: Response) => {
  const query = 'SELECT * FROM tags';
  const SQLInstance = await MySQLSingleton.getInstance();

  try {
    const tags = await getTagsService();
    const response = tags.map((tag) => ({ ...tag }));
    handleResponse(res.status(HttpStatusEnum.OK), { tags: response });
  } catch (error: any) {
    handleResponse(res.status(HttpStatusEnum.OK));
  }
};
