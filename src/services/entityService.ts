import { Entity, Tag } from '../core/database/models';
import { MySQLSingleton } from '../core/database/mysql';
import { ResponseData } from '../core/handler/responseHandler';

export const insertEntityService = async (link: string, link_img: string): Promise<number> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const queryInsertEntities = 'INSERT INTO entities (link, link_img) VALUES (?, ?)';
  const result = await SQLInstance.query(queryInsertEntities, [link, link_img]);
  return result.insertId;
};

export const getEntityService = async (entityId: number): Promise<Entity> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const queryGetInsertEntity = 'SELECT * FROM entities WHERE entity_id = ?';
  const result = await SQLInstance.query(queryGetInsertEntity, [entityId]);
  return result[0];
};
export const updateEntityService = async (
  entityId: number,
  link: string,
  linkImg: string,
): Promise<void> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const query = 'UPDATE entities SET link = ?, link_img = ? WHERE entity_id = ?';
  await SQLInstance.query(query, [link, linkImg, entityId]);
};

export const deleteEntityService = async (entityId: number): Promise<void> => {
  const deleteQuery = 'DELETE FROM entities WHERE entity_id = ?';
  const SQLInstance = await MySQLSingleton.getInstance();
  await SQLInstance.query(deleteQuery, [entityId]);
};
export const getAllEntitiesService = async (): Promise<Entity[]> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const query = 'SELECT * FROM entities';
  try {
    const result: Entity[] = await SQLInstance.query(query);
    return result;
  } catch (e) {
    console.error('Error fetch data:', e);
    throw new Error('Error fetch data' + e);
  }
};
