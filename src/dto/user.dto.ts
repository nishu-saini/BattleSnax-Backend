import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 13)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class UserLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditUserProfileInputs {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 20)
  address: string;
}

export class OrderInputs {
  _id: string;
  unit: number;
}

export interface userPayload {
  _id: string;
  email: string;
  verified: boolean;
}
