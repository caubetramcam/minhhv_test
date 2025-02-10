import { UserService } from "@app/user/user.service";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { IRequest } from "src/common/interface/common.interface";
import { CheckTokenGuard } from "src/common/guards/check-token.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('login')
    async login(@Body() payload: LoginDto) {
        return await this.userService.login(payload);
    }

    @Get('profile')
    @UseGuards(CheckTokenGuard)
    async getProfile(@Req() req: IRequest) {
        return await this.userService.getProfile(req?.user?.userId);
    }
}