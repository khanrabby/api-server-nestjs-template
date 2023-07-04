import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { TagResponse } from "./dto/tag-response.dto";
import { TagCreateRequest } from "./dto/tag-request.dto";
import { TagDatabase } from "./repository/tag.repository";
import { TagUpdateRequest } from "./dto/tag-update-request.dto";
import { TagsResponse } from "./dto/tags-response.dto";

@Injectable()
export class TagService {
  public constructor(private readonly db: TagDatabase) {}

  public async gettagByUserId(userId: string): Promise<TagsResponse> {
    const entities = await this.db.gettagUserId(userId);
    return {
      tags: entities,
    };
  }

  public async gettags(userId: string, date: string): Promise<TagResponse[]> {
    const entities = await this.db.gettags(userId, date);
    return entities;
  }

  public async createTag(
    tagCreateRequest: TagCreateRequest,
    userId: string
  ): Promise<TagResponse> {
    const companyId = "209309";
    const tagList = await this.db.gettagUserId(userId);
    const tagData = tagList.filter(
      (item: TagResponse) =>
        item.title.toLowerCase() == tagCreateRequest.title.toLowerCase()
    );
    if (tagData && tagData.length) {
      throw new BadRequestException("Tag already exists");
    } else {
      const toEntity = TagCreateRequest.toEntity(
        tagCreateRequest,
        userId,
        companyId
      );
      const createdEntity = await this.db.createTag(toEntity);
      if (!createdEntity)
        throw new InternalServerErrorException("Failed to create the record");
      return createdEntity;
    }
  }

  public async updateTag(
    tagUpdateRequest: TagUpdateRequest,
    userId: string
  ): Promise<TagResponse> {
    const companyId = "209309";
    const entity = TagUpdateRequest.toEntity(
      tagUpdateRequest,
      userId,
      companyId
    );
    const createdEntity = await this.db.updateTag(entity);
    if (!createdEntity)
      throw new InternalServerErrorException("Failed to create the record");
    return createdEntity;
  }

  public async updateTagCount(id: number, count: number): Promise<Boolean> {
    const createdEntity = await this.db.updateTagCount(id, count);
    if (!createdEntity)
      throw new InternalServerErrorException("Failed to create the record");
    return createdEntity;
  }

  public async deletetag(id: number, userId: string): Promise<Boolean> {
    return await this.db.deletetag(id, userId);
  }
}
