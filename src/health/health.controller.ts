import {
  Body,
  Controller,
  Injectable,
  Post,
  Request,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  Res,
  Redirect,
  BadRequestException,
  ForbiddenException
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { HealthService } from "./health.service";




@Injectable()
@Controller("main/public/health")
@ApiTags("health")
export class HealthController {
  public constructor(private service: HealthService) { }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  public async processTranscript(): Promise<string> {
    return 'Development Server is running!';
  }
}