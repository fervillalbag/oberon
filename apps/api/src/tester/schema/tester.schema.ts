import { ObjectType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@ObjectType()
export class Tester {
  @Field(() => String)
  id: string;

  @Field(() => String)
  @MinLength(3)
  name: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
