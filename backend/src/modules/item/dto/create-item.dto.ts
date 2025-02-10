import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { splitCdnUrl } from 'src/helper';

export class CreateItemFileDto {
  @ApiPropertyOptional({ name: 'id', description: 'id file name' })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({ name: 'fileName', description: 'file name' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ name: 'path', description: 'file path upload' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (value) {
      return splitCdnUrl(value);
    }
    return [];
  })
  path: string;

  @ApiProperty({ name: 'originalName', description: 'origina name' })
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @ApiProperty({ name: 'size', description: 'file size' })
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @ApiProperty({ name: 'mimeType', description: 'mime type' })
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @ApiProperty({ name: 'ext', description: 'ext file' })
  @IsNotEmpty()
  @IsString()
  ext: string;
}

export class CreateItemDto {
  @ApiProperty({
    name: 'name',
    required: true,
    type: String,
    description: 'Item name',
    example: 'Item 1',
  })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    name: 'price',
    required: false,
    type: Number,
    description: 'Item price',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    name: 'types',
    required: true,
    type: [String],
    description: 'Item types',
    example: ['Type 1', 'Type 2'],
  })
  @IsOptional()
  @IsArray()
  types: string[];

  @ApiPropertyOptional({
    name: 'categories',
    required: true,
    type: [String],
    description: 'Item categories',
    example: ['Category 1', 'Category 2'],
  })
  @IsOptional()
  @IsArray()
  categories: string[];

  @ApiPropertyOptional({
    name: 'images',
    required: true,
    type: CreateItemFileDto,
    isArray: true,
    description: 'Images',
    example: [
      {
        fileName: 'file name',
        originalName: 'original name',
        path: 'path',
        size: 100,
        mimeType: 'image',
        ext: '.png',
      },
    ],
  })
  @Type(() => CreateItemFileDto)
  @ValidateNested({ each: true })
  @IsArray()
  images: CreateItemFileDto[];
}
