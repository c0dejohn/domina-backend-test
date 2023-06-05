import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {plainToInstance} from "class-transformer";
import {CreateUserDto} from "../dto/create-user.dto";


export type UserDocument = User & Document;

@Schema({  timestamps: true , collection: 'users'})
export class User {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true , unique: true})
    username: string;

    @Prop({ required: false })
    password: string;

    static build(createUserDto: CreateUserDto): User {
        return plainToInstance(User, createUserDto  as User);
    }
}
export const UserSchema = SchemaFactory.createForClass(User);



