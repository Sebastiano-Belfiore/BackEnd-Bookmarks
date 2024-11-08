import dotenv from 'dotenv';
import { getTagIdByNameService, insertTagService } from '../src/services/tagService';
import { insertEntityService } from '../src/services/entityService';
import { insertEntityTagsService } from '../src/services/entitytagsService';
import { MySQLSingleton } from '../src/core/database/mysql';
dotenv.config();

const repeatCount = 5;
async function seedDatabase() {
  const tags = [
    { name: 'UNTAGGED', color: '242424', is_favorite: false },
    { name: 'PDF', color: 'FF5733', is_favorite: false },
    { name: 'VIDEO', color: 'FFC300', is_favorite: false },
    { name: 'YOUTUBE', color: 'DAF7A6', is_favorite: false },
    { name: 'MUSIC', color: 'C70039', is_favorite: false },
    { name: 'GITHUB', color: '900C3F', is_favorite: false },
    { name: 'GAME', color: '581845', is_favorite: false },
    { name: 'TYPESCRIPT', color: '007ACC', is_favorite: true },
    { name: 'REACT', color: '61DAFB', is_favorite: true },
    { name: 'NODEJS', color: '8CC84B', is_favorite: false },
    { name: 'JAVASCRIPT', color: 'F7DF1E', is_favorite: false },
    { name: 'UNITY3D', color: 'FFF', is_favorite: true },
    { name: 'WEB-DEV', color: '008CBA', is_favorite: true },
    { name: 'GAME-DEV', color: 'FF4500', is_favorite: true },
    { name: 'HTML', color: 'FF4500', is_favorite: true },
    { name: 'CSS', color: 'FF4500', is_favorite: true },
    { name: 'OOT', color: 'FF4500', is_favorite: true },
  ];

  await Promise.all(tags.map((tag) => insertTagService(tag.name, tag.color, tag.is_favorite)));
  console.log('Tags added');

  const entities = [
    {
      link: 'https://www.adobe.com/it/acrobat/about-adobe-pdf.html',
      link_img: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg',
      tags: ['PDF'],
    },
    {
      link: 'https://www.youtube.com/watch?v=_73UBoDZDLo',
      link_img: 'https://i3.ytimg.com/vi/_73UBoDZDLo/maxresdefault.jpg',
      tags: ['VIDEO', 'YOUTUBE', 'GAME-DEV', 'UNITY3D'],
    },
    {
      link: 'https://www.youtube.com/watch?v=tVzUXW6siu0&list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w',
      link_img: 'https://i3.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg',
      tags: ['VIDEO', 'YOUTUBE', 'WEB-DEV', 'HTML', 'CSS', 'JAVASCRIPT'],
    },
    {
      link: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      link_img: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      tags: ['VIDEO', 'YOUTUBE', 'WEB-DEV', 'JAVASCRIPT', 'TYPESCRIPT', 'REACT', 'NODEJS'],
    },
    {
      link: 'https://www.youtube.com/watch?v=NJR0E8NmUWM',
      link_img: 'https://i3.ytimg.com/vi/NJR0E8NmUWM/maxresdefault.jpg',
      tags: ['VIDEO', 'YOUTUBE', 'GAME', 'OOT'],
    },
  ];

  const repeatedEntities = Array(repeatCount).fill(entities).flat();

  const insertEntityPromises = repeatedEntities.map((entity) =>
    insertEntityService(entity.link, entity.link_img),
  );
  const insertEntityResults = await Promise.all(insertEntityPromises);

  const tagIdsPromises = repeatedEntities.map((entity) =>
    Promise.all(entity.tags.map((tag: string) => getTagIdByNameService(tag))),
  );
  const tagIdsResults = await Promise.all(tagIdsPromises);

  const associationPromises = insertEntityResults.map((entityResult, index) => {
    const entityId = entityResult;
    const tagIds = tagIdsResults[index];
    return insertEntityTagsService(entityId, tagIds);
  });

  await Promise.all(associationPromises);
  console.log('Tags associated with entities successfully.');
}

seedDatabase()
  .catch((error) => console.error('Error in the seeding process:', error))
  .finally(() => {
    console.log('database ready');
    MySQLSingleton.closeConnection();
  });
