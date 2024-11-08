import { Entity, Tag } from '../core/database/models';
import { MySQLSingleton } from '../core/database/mysql';
import { ResponseData } from '../core/handler/responseHandler';

export const getTagsService = async (): Promise<Tag[]> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const querySelectAllTag = 'SELECT * FROM tags';
  return await SQLInstance.query(querySelectAllTag);
};
export const getTagService = async (tag_id: number): Promise<Tag> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const queryGetInsertEntity = 'SELECT * FROM tags WHERE tag_id = ?';
  const result = await SQLInstance.query(queryGetInsertEntity, [tag_id]);
  return result;
};
export const getTagIdByNameService = async (name: string): Promise<number> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const queryGetInsertEntity = 'SELECT tag_id FROM tags WHERE name = ?';
  const result = await SQLInstance.query(queryGetInsertEntity, [name]);
  return result[0].tag_id;
};

export const getUntaggedTagService = async (): Promise<Tag> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const query = `SELECT * FROM tags WHERE name = 'UNTAGGED'`;
  const result = await SQLInstance.query(query);
  if (result.length <= 0) throw new Error('UNTAGGED TAG not FOUND');
  return result[0];
};
export const insertTagService = async (
  name: string,
  color: string,
  is_favorite: boolean,
): Promise<void> => {
  const insertQuery = 'INSERT INTO tags (name, color, is_favorite) VALUES (?, ?, ?)';
  const SQLInstance = await MySQLSingleton.getInstance();
  await SQLInstance.query(insertQuery, [name, color, is_favorite]);
};

export const getInsertedTagService = async (): Promise<Tag> => {
  const selectQuery = 'SELECT * FROM tags WHERE tag_id = LAST_INSERT_ID()';
  const SQLInstance = await MySQLSingleton.getInstance();
  const result = await SQLInstance.query(selectQuery);
  return result[0];
};
export const getTagsForEntitiesService = async (
  entities: Entity[],
): Promise<{ [key: number]: Tag[] }> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const tagsQuery = `
    SELECT entity_id, tags.tag_id, tags.name, tags.color, tags.created_at, tags.updated_at, tags.is_favorite
    FROM entitytags 
    JOIN tags ON tags.tag_id = entitytags.tag_id
    WHERE entity_id IN (${entities.map(() => '?').join(', ')});`;

  try {
    const result: {
      entity_id: number;
      tag_id: number;
      name: string;
      color: string;
      created_at: Date;
      updated_at: Date;
      is_favorite: boolean;
    }[] = await SQLInstance.query(
      tagsQuery,
      entities.map((entity) => entity.entity_id),
    );

    const tagsMap: { [key: number]: Tag[] } = {};
    result.forEach((row) => {
      if (!tagsMap[row.entity_id]) {
        tagsMap[row.entity_id] = [];
      }
      tagsMap[row.entity_id].push({
        tag_id: row.tag_id,
        name: row.name,
        color: row.color,
        created_at: row.created_at,
        updated_at: row.updated_at,
        is_favorite: row.is_favorite,
      });
    });

    return tagsMap;
  } catch (e) {
    console.error('Error fetching entity tags:', e);
    throw new Error('Error fetching entity tags: ' + e);
  }
};
export const getTagsForEntityService = async (entity_id: number): Promise<Tag[]> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const tagsQuery = `
    SELECT  tags.tag_id, tags.name, tags.color, tags.created_at, tags.updated_at, tags.is_favorite
    FROM entitytags 
    JOIN tags ON tags.tag_id = entitytags.tag_id
    WHERE entity_id  = ?`;

  try {
    const result: Tag[] = await SQLInstance.query(tagsQuery, [entity_id]);

    return result;
  } catch (e) {
    console.error('Error fetching entity tags:', e);
    throw new Error('Error fetching entity tags: ' + e);
  }
};
export const updateTagService = async (
  tag_id: number,
  name: string,
  color: string,
  is_favorite: boolean,
): Promise<void> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const query = 'UPDATE tags SET name = ?, color = ?, is_favorite = ? WHERE tag_id = ?';
  await SQLInstance.query(query, [name, color, is_favorite, tag_id]);
};
export const deleteTagService = async (tag_id: number): Promise<void> => {
  const deleteQuery = 'DELETE FROM tags WHERE tag_id = ?';
  const SQLInstance = await MySQLSingleton.getInstance();
  await SQLInstance.query(deleteQuery, [tag_id]);
};
