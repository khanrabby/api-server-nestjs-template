import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class IsRequiredPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException(`Validation error: ${metadata.data} is a required field.`);
    return value;
  }
}
