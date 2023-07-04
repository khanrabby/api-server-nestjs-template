import {
  Body,
  Controller,
  Injectable,
  Post,
  Request,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  InternalServerErrorException,
  Get,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { TagService } from "./tag.service";
import { TagCreateRequest } from "./dto/tag-request.dto";
import { AuthenticatedRequest } from "authenticated.request";
import { IsRequiredPipe } from "../util/pipe/is-required.pipe";
import { TagResponse } from "./dto/tag-response.dto";
import { TagUpdateRequest } from "./dto/tag-update-request.dto";
import { TagsResponse } from "./dto/tags-response.dto";
import { TagUpdateResponse } from "./dto/tag-update-response";

@Injectable()
@Controller("main/tags")
@ApiTags("Tags")
@ApiBearerAuth()
export class TagController {
  public constructor(private service: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: TagCreateRequest })
  @ApiCreatedResponse({ type: TagResponse })
  public async createtag( @Request() request: AuthenticatedRequest, @Body() requestBody: TagCreateRequest): Promise<TagResponse> {
    const userId = request.raw.user.userId;
    return await this.service.createTag(requestBody, userId);
  }

  @Get()
  @ApiOkResponse({ type: TagsResponse })
  public async getTags(
    @Request() request: AuthenticatedRequest
  ): Promise<TagsResponse> {
    const userId = request.raw.user.userId;
    return await this.service.gettagByUserId(userId);
  }

  @Put()
  @ApiBody({ type: TagUpdateRequest })
  @ApiOkResponse({ type: TagsResponse })
  public async updateTag(
    @Request() request: AuthenticatedRequest,
    @Body() requestBody: TagUpdateRequest
  ): Promise<TagUpdateResponse> {
    const userId = request.raw.user.userId;
    const updated = await this.service.updateTag(requestBody, userId);
    if (!updated) {
      throw new InternalServerErrorException(
        "Failed to delete contact relationship data."
      );
    }
    return updated;
  }
  @Delete(":id")
  @ApiOkResponse({ type: Boolean })
  @ApiOperation({ operationId: "deletetag" })
  public async deletetag(
    @Request() request: AuthenticatedRequest,
    @Param("id", IsRequiredPipe) id: number
  ): Promise<Boolean> {
    const userId = request.raw.user.userId;
    return await this.service.deletetag(id, userId);
  }
}