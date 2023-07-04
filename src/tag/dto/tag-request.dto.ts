import { IsString, MaxLength, MinLength} from "class-validator";
import { TagEntity } from "../repository/tag.entity";

export class TagCreateRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public title: string;

  public static toEntity(request:TagCreateRequest,userId:string,companyId:string): TagEntity {
    const entity = new TagEntity();
    entity.userId = userId;
    entity.companyId = companyId;
    entity.title = request.title
    entity.status = true;
    entity.createdAt= new Date();
    return entity;
  }
}
