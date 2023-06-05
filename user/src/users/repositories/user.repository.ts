import {BadRequestException, Injectable, Logger,} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from "../entity/user.entity";


@Injectable()
export class UserRepository {
    private static readonly logger = new Logger(UserRepository.name);
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async create(user: User): Promise<User> {
        return  this.userModel
            .create(user)
            .catch((error) => {
                throw new BadRequestException({message: 'Bad Request'})
            });
    }

    async findByUserName(username: string ) {
        return this.userModel.findOne({ username })
            .catch((err) => {
                UserRepository.logger.error(err);
            });
    }

}
