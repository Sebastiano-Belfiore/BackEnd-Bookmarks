import { Request, Response } from 'express';
import { handleResponse } from '../../core/handler/responseHandler';
import { HttpStatusCode } from 'axios';
import { insertTagService, getInsertedTagService } from '../../services/tagService';

export const insertTag = async (req: Request, res: Response) => {
  const { name, color, is_favorite }: { name: string; color: string; is_favorite: boolean } =
    req.body;

  try {
    await insertTagService(name, color, is_favorite);

    const result = await getInsertedTagService();

    handleResponse(res.status(HttpStatusCode.Created), { tag: result });
  } catch (error: any) {
    console.error("Errore durante l'inserimento del tag:", error);
    handleResponse(res.status(HttpStatusCode.InternalServerError), null, {
      code: error.code || -1,
      message: error.message || 'An unexpected error occurred',
    });
  }
};
