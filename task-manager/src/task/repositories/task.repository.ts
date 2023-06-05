import {BadRequestException, Injectable, InternalServerErrorException, Logger,} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Task, TaskDocument} from "../entities/task.entity";
import {UpdateTaskDto} from "../dto/update-task.dto";


@Injectable()
export class TaskRepository {
    private static readonly logger = new Logger(TaskRepository.name);
    private static readonly DUPLICATED_KEY_ERROR_CODE = 11000;
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel: Model<TaskDocument>,
    ) {}

    async create(task: Task): Promise<Task> {
        return  this.taskModel
            .create(task)
            .catch((error) =>TaskRepository.handleDuplicatedError(error) );
    }

    async findByUserName(username: string) {
        return this.taskModel.find({ username })
            .catch((err) => {
                TaskRepository.logger.error(err);
            });
    }

     async update(task: UpdateTaskDto) {
         this.taskModel
            .findByIdAndUpdate(task._id, task)
            .catch((err) => {
                TaskRepository.logger.error(err);
            });
    }



    async delete(id: string){
        return this.taskModel.findByIdAndDelete(id).catch((err) => {
            TaskRepository.logger.error(err);
        });
    }

    static handleDuplicatedError(error: Error & { code: number }): never {
        if (error?.code === TaskRepository.DUPLICATED_KEY_ERROR_CODE) {
            TaskRepository.logger.warn(error);
            throw new BadRequestException({
                message: 'Rating already exists',
            });
        }
        throw new InternalServerErrorException({
            message: 'An error occurred while saving the rating',
        });
    }
}
