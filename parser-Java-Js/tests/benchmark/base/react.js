'use strict';
export interface IRelationTag extends ITag {
  relType: RELATION_TYPE;
  objId: number;
  ownerObjId: number;
  relationId: number;
  // 实例方法
}
