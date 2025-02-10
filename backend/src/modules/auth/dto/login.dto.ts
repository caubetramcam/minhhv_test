import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'Username',
        example: 'admin',
        name: 'username'
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password',
        example: '123456',
        name: 'password'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}