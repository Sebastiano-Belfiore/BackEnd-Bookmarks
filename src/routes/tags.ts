import { Router } from 'express';
import { getAllTags } from '../controllers/tags/getAllTags';
import { getRecentUsage } from '../controllers/tags/tagsRecentUsage';
import { getUsageCount } from '../controllers/tags/tagUsageCount';
import { getTagsCoOccurrences } from '../controllers/tags/getTagsCoOccurrences';
import { insertTag } from '../controllers/tags/insertTag';
import { updateTag } from '../controllers/tags/updateTag';
import { deleteTag } from '../controllers/tags/deleteTag';

const router = Router();
router.get('/', getAllTags);
router.get('/recent', getRecentUsage);
router.get('/countUsage', getUsageCount);
router.get('/tagscooccurence', getTagsCoOccurrences);
router.post('/insert', insertTag);
router.put('/:tag_id', updateTag);
router.delete('/:tag_id', deleteTag);

export const tags = router;
