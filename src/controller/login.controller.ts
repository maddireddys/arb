import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import {UserDto} from "../dto/UserDto";
import { ResponseDto } from 'src/dto/ResponseDto';
import { AuthService } from 'src/service/auth.service';
import { AuthGuard } from 'src/guard/AuthGuard';

@Controller()
export class LoginController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,) {}

  @Post("/login")
  async login(@Body() userDto: UserDto): Promise<ResponseDto> {
    return await this.authService.login(userDto);
  }

  @Post("/logout")
  @UseGuards(AuthGuard)
  async logout(@Body() userDto: UserDto): Promise<ResponseDto> {
    return await this.authService.logout(userDto);
  }
}
