import { Injectable, Scope } from '@nestjs/common';
import { User } from 'src/entity/User';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
    public loggedInUser: User; 
}
