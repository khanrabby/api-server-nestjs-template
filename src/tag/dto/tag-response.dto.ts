import { TagEntity } from "../repository/tag.entity";
import { TagUpdateRequest } from "./tag-update-request.dto";

export class TagResponse {
  public id: number;
  public userId: string;
  public title: string;
  public status: Boolean;
  public companyId: string;
  public count?: number;

  public static fromEntity(entity: TagResponse): TagResponse {
    const response = new TagResponse();
    response.id = entity.id;
    response.userId = entity.userId;
    response.title = entity.title;
    response.status = entity.status;
    response.companyId = entity.companyId;
    response.count = entity.count;
    return response;
  }
}
