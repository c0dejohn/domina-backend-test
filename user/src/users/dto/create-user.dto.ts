import {Expose} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, IsStrongPassword} from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {
    @Expose()
    @IsOptional()
    _id?: mongoose.Schema.Types.ObjectId;
    @Expose({name: 'username'})
    @IsNotEmpty()
    @IsString()
    username: string;
   @IsNotEmpty()
    @IsString()
    @Expose({name: 'password'})
    @IsStrongPassword()
    password: string;

}
