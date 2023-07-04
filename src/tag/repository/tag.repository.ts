import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagCreateRequest } from "../dto/tag-request.dto";
import { TagResponse } from "../dto/tag-response.dto";
import { TagEntity } from "./tag.entity";
@Injectable()
export class TagDatabase {
  public constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>
  ) {}

  public async gettagUserId(userId: string): Promise<TagEntity[]> {
    return await this.repository.find({
      where: [
        {
          userId: userId,
        },
      ],
      order: {
        id: "DESC",
      },
    });
  }

  public async gettags(userId: string, date: string): Promise<TagEntity[]> {
    //const createdAt = new Date(date);
    return await this.repository.find({
      where: [
        {
          userId: userId,
          //createdAt: createdAt,
        },
      ],
      order: {
        count: "DESC",
      },
      skip: 0,
      take: 30,
    });
  }

  public async createTag(tagRequest: TagEntity): Promise<TagEntity> {
    const insertThreadResult = await this.repository.insert(tagRequest);
    tagRequest.id = insertThreadResult.identifiers[0].id;
    return tagRequest;
  }

  public async deletetag(id: number, userId: string): Promise<Boolean> {
    const updateResult: any = await this.repository.delete({
      id: id,
      userId: userId,
    });
    return updateResult.affected !== undefined && updateResult.affected > 0;
  }

  public async updateTag(tagRequest: TagEntity): Promise<TagEntity> {
    const updateResult = await this.repository.update(
      { id: tagRequest.id },
      { title: tagRequest.title }
    );
    return tagRequest;
  }
  public async updateTagCount(id: number, count: number): Promise<boolean> {
    const updateResult = await this.repository.update(
      { id: id },
      { count: count }
    );
    return true;
  }
}
