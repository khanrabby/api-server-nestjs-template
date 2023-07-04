import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

interface NumericRangePipeConstraint {
  required?: boolean;
  min?: number;
  max?: number;
}

@Injectable()
export class NumericRangePipe implements PipeTransform, NumericRangePipeConstraint {
  public required?: boolean;
  public min?: number;
  public max?: number;

  public constructor(constraint: NumericRangePipeConstraint) {
    const { required, min, max } = constraint;
    this.required = required;
    this.min = min;
    this.max = max;
  }

  public transform(value: unknown, metadata: ArgumentMetadata) {
    if (this.required && !value) throw new BadRequestException(`Validation error: ${metadata.data} is a required field.`);
    if ((this.min !== undefined || this.max !== undefined) && isNaN(parseFloat(value as string)))
      throw new BadRequestException(`Validation error: number is expected for ${metadata.data}`);
    if (this.min !== undefined && parseFloat(value as string) < this.min)
      throw new BadRequestException(`Validation error: ${metadata.data} cannot be less than ${this.min}`);
    if (this.max !== undefined && parseFloat(value as string) > this.max)
      throw new BadRequestException(`Validation error: ${metadata.data} cannot be greater than ${this.max}`);

    return value;
  }
}
