import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getProfile(id: string): Promise<UserEntity> {
    const user = this.userRepo.findOneBy({ id, isActive: true });
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
    return user;
  }

  async login(payload: LoginDto) {
    const user = await this.userRepo.findOneBy({
      username: payload.username,
      isDeleted: false,
      isActive: true,
    });
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(
      payload?.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }
    const accessToken = this.jwtService.sign({
      userId: user?.id,
      sub: user?.username,
      name: user?.fullName,
      grantType: 'local',
    });
    return accessToken;
  }
}
