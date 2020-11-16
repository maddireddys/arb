import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import {UserDto} from "../dto/UserDto";
import { User } from 'src/entity/User';
import { ResponseDto } from 'src/dto/ResponseDto';
import { AuthGuard } from 'src/guard/AuthGuard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user/register')
  async registerUser(@Body() userDto: UserDto): Promise<ResponseDto> {
    return await this.userService.registerUser(userDto);
  }
}
