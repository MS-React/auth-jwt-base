import {
  Route,
  Controller,
  Post,
  Body,
  Tags
} from 'tsoa';

import { ProvideSingleton, inject } from '../ioc';
import { UserService } from '../services';
import { UserFormatter } from '../models';
import { ApiError } from '../config/ErrorHandler';
import constants from '../config/constants';
import { sign } from 'jsonwebtoken';

interface ILogin {
  name: string;
  password: string;
}

@Tags('auth')
@Route('auth')
@ProvideSingleton(AuthController)
export class AuthController extends Controller {
  constructor(@inject(UserService) private service: UserService) {
    super();
  }

  @Post('login')
  public async login(@Body() body: ILogin): Promise<any> {
    const user = await this.service.login(body);

    if (user instanceof UserFormatter) {
      var payload = { id: user.id, rol: user.rol };
      var jwtSignature = sign(payload, 'somesecret', { expiresIn: 3600 });
      return {
        jwtSignature,
        payload
      };
    }
    
    throw new ApiError(constants.errorTypes.auth);
  }
}