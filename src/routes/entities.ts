import { Router } from 'express';
import { getAllEntities } from '../controllers/entities/getAllEntities';
import { getEntitiesByTags } from '../controllers/entities/getEntitiesByTags';
import { insertEntity } from '../controllers/entities/insertEntity';
import { updateEntity } from '../controllers/entities/updateEntity';
import { deleteEntity } from '../controllers/entities/deleteEntity';

const router = Router();
router.get('/getAllEntities', getAllEntities);
router.post('/', insertEntity);
router.put('/:entity_id', updateEntity);
router.delete('/:entity_id', deleteEntity);
router.post('/getEntitiesByTags', getEntitiesByTags);

//router.get('/:id', getEntitiesById);
//router.post('/searchTagByName', getEntitiesByTagsName);

export const entities = router;
