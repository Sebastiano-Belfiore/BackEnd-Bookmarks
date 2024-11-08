import { Tag } from './core/database/models';

export interface insertEntitiesReq {
  link: string;
  link_img: string;
  tags: Tag[] | undefined;
}
export type SearchFilter = 'ANY' | 'ALL';

export interface insertTagReq {
  name: string;
  color: string[6];
  is_favorite: boolean;
}
