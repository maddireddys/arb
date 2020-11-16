import { Injectable } from '@nestjs/common';
import {getManager, getConnection} from "typeorm";
import {User} from "../entity/User";
import {UserDto} from "../dto/UserDto";
import { plainToClass } from 'class-transformer';
import { ResponseDto } from 'src/dto/ResponseDto';
import { RespStatus } from 'src/enums/RespStatus';


@Injectable()
export class UserService {
	constructor() {
	}
	async registerUser(userDto: UserDto): Promise<ResponseDto> {
		let resp = new ResponseDto();
		resp.status = RespStatus.FAILED;
		const bcrypt = require('bcrypt');
		const saltRounds = 10;
		  const user = plainToClass(User, userDto);
		  const salt = "$2b$10$ZJUO55tabTHYEy7plG5KP.";
          const hash = bcrypt.hashSync(userDto.pwd, salt);
		  return await getManager().transaction(async transactionalEntityManager => {
			user.password = hash;
			let savedObj =  await transactionalEntityManager.save(user);
			resp.status = RespStatus.SUCCESS;
			resp.data = savedObj;
			return resp;
		});
		  
	}

	async findOne(userName: string): Promise<User> {
		let userRepository = getConnection().getRepository(User);
		return await userRepository.findOne({ email: userName });
	}
	
	async findById(userId: number): Promise<User> {
		let userRepository = getConnection().getRepository(User);
		return await userRepository.findOneOrFail({ id: userId });
    }
	
}
