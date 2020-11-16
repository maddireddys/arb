import { Injectable, Inject, CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ResponseDto } from 'src/dto/ResponseDto';
import { RespStatus } from 'src/enums/RespStatus';
import { UserService } from './user.service';
import { UserContextService } from './user-context.service';

@Injectable()
export class AuthService {

    constructor(private userService: UserService, 
        private jwtService: JwtService, 
        @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user) {
            const bcrypt = require('bcrypt');
            const salt = "$2b$10$ZJUO55tabTHYEy7plG5KP.";
            const hash = bcrypt.hashSync(pass, salt);
            console.log("hash:"+hash);
            if(hash === user.password) {
                
                return user;
            }
        }
        return null;
    }

    async login(user: any): Promise<ResponseDto> {
        
        let ret = await this.validateUser(user.username, user.pwd);
        let rslt = new ResponseDto();
        if(ret) {
            const payload = { username: user.username, sub: ret.id, type:ret.type};
            rslt.status = RespStatus.SUCCESS;
            let accessToken  = this.jwtService.sign(payload);
            await this.cacheManager.set(ret.id, accessToken, {ttl: (1296000)}); // ttl 15 days
            rslt.data = {
                token: accessToken,
                name : ret.firstName +' ' + ret.lastName,
                username: ret.email,
                type: ret.type,
                id: ret.id
            }
        } else {
            rslt.status = RespStatus.FAILED;
            rslt.data = {
                message: "Invalid credentials"
            }
        }
        return rslt;
      }

      async verifyToken(token: string): Promise<any> {
          let t = this.jwtService.verify(token);
          let payload = await this.jwtService.decode(token, {json:true});
          let userId = payload.sub;
          let accessToken = await this.cacheManager.get(userId);
          let ret = false;
          if(accessToken && accessToken === token) {
            ret = true;
            return ret;
          } 

            throw new UnauthorizedException();
      }
      async logout(user: any): Promise<any> {
        await this.cacheManager.del(user.id);
        return true;
      }
}
