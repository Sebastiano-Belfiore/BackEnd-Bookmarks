import { Entity, EntityTags, Tag } from '../core/database/models';
import { MySQLSingleton } from '../core/database/mysql';
import { getUntaggedTagService } from './tagService';

export const insertEntityTagsService = async (
  entityId: number,
  tagIds: number[],
): Promise<void> => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const queryInsertEntityTags = 'INSERT INTO entitytags (entity_id, tag_id) VALUES (?, ?)';
  await Promise.all(
    tagIds.map((tagId) => SQLInstance.query(queryInsertEntityTags, [entityId, tagId])),
  );
};
export const deleteEntityTagsServiceByEntityId = async (entityId: number, tagIds: number[]) => {
  const SQLInstance = await MySQLSingleton.getInstance();
  const query = `DELETE FROM entitytags WHERE entity_id = ? AND tag_id IN (?)`;
  await SQLInstance.query(query, [entityId, tagIds]);
};
export const getEntityTagsForEntitiesService = async (
  entities_id: number[],
): Promise<EntityTags[]> => {
  const SQLInstance = await MySQLSingleton.getInstance();

  if (entities_id.length === 0) {
    return [];
  }

  const tagsQuery = `
    SELECT *
    FROM entitytags 
    WHERE entity_id IN (${entities_id.map(() => '?').join(', ')})`;

  try {
    const result: EntityTags[] = await SQLInstance.query(tagsQuery, entities_id);
    return result;
  } catch (error) {
    console.error('Error fetching entity tags:', error);
    throw new Error('Error fetching entity tags');
  }
};
