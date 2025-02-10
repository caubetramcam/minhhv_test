import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CheckTokenGuard } from 'src/common/guards/check-token.guard';

@Controller('upload')
@UseGuards(CheckTokenGuard)
export class UploadController {
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new Error('File type not allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // return { filename: file.filename, path: `/uploads/${file.filename}` };
    return {
      fileName: file?.filename,
      originalName: file?.originalname,
      path: `uploads/${file?.filename}`,
      size: file?.size,
      mimeType: file?.mimetype,
      ext: extname(file.originalname),
    };
  }

  // @Post('multiple')
  // @UseInterceptors(
  //   FilesInterceptor('files', 5, {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     limits: { fileSize: 2 * 1024 * 1024 },
  //     fileFilter: (req, file, callback) => {
  //       const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  //       if (!allowedTypes.includes(file.mimetype)) {
  //         return callback(new BadRequestException('File type not allowed'), false);
  //       }
  //       callback(null, true);
  //     },
  //   }),
  // )
  // uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
  //   if (!files || files.length === 0) {
  //     throw new BadRequestException('No files uploaded');
  //   }
  //   return files.map((file) => ({
  //     filename: file.filename,
  //     url: `/uploads/${file.filename}`,
  //   }));
  // }
}
