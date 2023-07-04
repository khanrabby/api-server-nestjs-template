import { ApiProperty } from "@nestjs/swagger";
import { ErrorCodes } from "./error-codes.enum";

export class ErrorResponseWithCode {
  message: string;
  debug?: string;
  @ApiProperty({ enum: ErrorCodes, enumName: "ErrorCodes" })
  code?: ErrorCodes;
}
