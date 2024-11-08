export interface Tag {
  tag_id: number;
  name: string;
  color: string;
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
}
export interface Entity {
  entity_id: number;
  link: string;
  link_img: string;
  created_at: Date;
  updated_at: Date;
}
export interface EntityReq {
  link: string;
  link_img: string;
  tags?: Tag[];
}
export interface TagReq {
  name: string;
  color: string;
  is_favorite: boolean;
}
export interface EntityTags {
  entity_id: number;
  tag_id: number;
  created_at: Date;
}
