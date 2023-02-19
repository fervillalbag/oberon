import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma.service';
import { AddUserArgs, EditUserArgs } from './args';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async singInToken(id: string, email: string, fullname: string) {
    const payload = { id, email, fullname };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRES_KEY,
      secret: process.env.SECRET_KEY,
    });

    return token;
  }

  async create(args: AddUserArgs): Promise<string> {
    try {
      const pswHash = await argon.hash(args.password);
      const user: User = await this.prisma.user.create({
        data: { ...args, password: pswHash },
      });

      const token = await this.singInToken(user.id, user.email, user.fullname);
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findFirstOrThrow({ where: { id } });
  }

  update(id: string, args: EditUserArgs) {
    try {
      // encrypt password
      return this.prisma.user.update({ where: { id }, data: args });
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
