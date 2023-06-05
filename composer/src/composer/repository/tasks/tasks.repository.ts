import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as util from 'util';
import {HttpClientService} from "../../../http-client/http-client.service";


@Injectable()
export class TasksRepository {
    private readonly logger = new Logger('TasksRepository');
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpClientService,

    ) {}

    async create(body){
        const url = `${await this.configService.get(
            'TASK_MANAGER_URL',
        )}`;

        this.logger.log('Request to task url');
        this.logger.log(url);
        this.logger.log('Request task Body');
        this.logger.log(
            util.inspect(body, {
                showHidden: false,
                depth: null,
                colors: true,
            }),
        );
        await this.httpService
            .post<any>({ url, body })
            .catch((error) => {
                this.logger.error(
                    util.inspect(error.response, {
                        showHidden: false,
                        depth: null,
                        colors: true,
                    }),
                );
                throw new InternalServerErrorException(
                    {
                        status: error.response.status,
                    }
                );
            });
    }

}
