import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value <= 0) {
      return 1;
    }
    return value;
  })
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value <= 0) {
      return 25;
    }
    return value;
  })
  size?: number = 25;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;
}
