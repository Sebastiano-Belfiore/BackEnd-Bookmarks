import { Request, Response } from 'express';
import { MySQLSingleton } from '../../core/database/mysql';
import { HttpStatusEnum } from '../../core/enums/httpcodes';
import { handleResponse, ResponseData } from '../../core/handler/responseHandler';

export const getTagsCoOccurrences = async (req: Request, res: Response) => {
  const query = `
  WITH tag_combinations AS (
    SELECT 
        t1.tag_id AS tag_id1, 
        t2.tag_id AS tag_id2
    FROM tags t1
    JOIN tags t2 ON t1.tag_id < t2.tag_id
),
co_occurrences AS (
    SELECT 
        tc.tag_id1, 
        tc.tag_id2,
        COUNT(DISTINCT et1.entity_id) AS co_occurrence_count
    FROM tag_combinations tc
    JOIN entitytags et1 ON tc.tag_id1 = et1.tag_id
    JOIN entitytags et2 ON tc.tag_id2 = et2.tag_id AND et1.entity_id = et2.entity_id
    GROUP BY tc.tag_id1, tc.tag_id2
),
total_counts AS (
    SELECT 
        tc.tag_id1,
        tc.tag_id2,
        COUNT(DISTINCT et.entity_id) AS total_count
    FROM tag_combinations tc
    JOIN entitytags et ON et.tag_id = tc.tag_id1 OR et.tag_id = tc.tag_id2
    GROUP BY tc.tag_id1, tc.tag_id2
)
SELECT 
    co.tag_id1, 
    co.tag_id2, 
    tc1.name AS name1,       
    tc1.color AS color1,     
    tc1.is_favorite AS is_favorite1, 
    tc1.created_at AS created_at1,   
    tc1.updated_at AS updated_at1,   
    tc2.name AS name2,       
    tc2.color AS color2,     
    tc2.is_favorite AS is_favorite2, 
    tc2.created_at AS created_at2,   
    tc2.updated_at AS updated_at2,   
    (co.co_occurrence_count * 100.0 / tc.total_count) AS co_occurrence_percentage
FROM co_occurrences co
JOIN total_counts tc ON co.tag_id1 = tc.tag_id1 AND co.tag_id2 = tc.tag_id2
JOIN tags tc1 ON co.tag_id1 = tc1.tag_id  
JOIN tags tc2 ON co.tag_id2 = tc2.tag_id; 
`;

  const SQLInstance = await MySQLSingleton.getInstance();

  try {
    const result = await SQLInstance.query(query);
    const formattedResult = result
      ? result.map((row: any) => ({
          tag1: {
            tag_id: row.tag_id1,
            name: row.name1,
            color: row.color1,
            is_favorite: row.is_favorite1,
            updated_at: row.updated_at1,
            created_at: row.created_at1,
          },
          tag2: {
            tag_id: row.tag_id2,
            name: row.name2,
            color: row.color2,
            is_favorite: row.is_favorite2,
            updated_at: row.updated_at2,
            created_at: row.created_at2,
          },
          co_occurrence: row.co_occurrence_percentage,
        }))
      : [];

    handleResponse(res.status(HttpStatusEnum.OK), { tags: formattedResult });
  } catch (error: any) {
    console.error('Error fetching tag co-occurrences:', error);
    handleResponse(res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR));
  }
};
