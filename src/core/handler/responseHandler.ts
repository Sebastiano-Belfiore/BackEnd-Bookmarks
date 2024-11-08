import { Response } from 'express';
import { logger } from '../logger/color';

export type Data = string | number | boolean | Date | object | null;
export type ResponseData = { [name: string]: Data } | null;
export type Error = { code: number; message: string } | null;
export type ResponseBody = { success: boolean; error: Error; data: ResponseData };

export const handleResponse = async (
  res: Response,
  data?: ResponseData,
  error?: Error,
): Promise<Response<ResponseBody>> => {
  if (error && error.code == 1062) {
    const errWords = error.message.split(' ');
    const entry = errWords[2];
    const fieldDB = errWords[5];
    const formattedField = fieldDB.substring(fieldDB.lastIndexOf('.') + 1, fieldDB.length);

    error.message = `Duplicate entry`;
  }
  const responseBody: ResponseBody = {
    success: !error && res.statusCode >= 200 && res.statusCode <= 299,
    error: error ? error : null,
    data: data ? data : null,
  };
  console.log('responseBody', responseBody);

  return res.json(responseBody);
};
