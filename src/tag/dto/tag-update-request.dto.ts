import { IsNumber } from "class-validator";
import { TagEntity } from "../repository/tag.entity";
import { TagCreateRequest } from "./tag-request.dto";

export class TagUpdateRequest extends TagCreateRequest {
  @IsNumber()
  public id: number;
  
  public static toEntity(request:TagCreateRequest,userId:string,companyId:string): TagEntity {
    const entity = new TagEntity();
    entity.userId = userId;
    entity.companyId = companyId;
    entity.title = request.title
    entity.status = true;
    return entity;
  }
}
