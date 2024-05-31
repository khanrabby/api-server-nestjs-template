import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MinLength} from "class-validator";

export class WebhookRequest {
    @IsString()
    @MinLength(1)
    public fileLocation: string;
}