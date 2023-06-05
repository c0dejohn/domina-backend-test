import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule, HttpModuleOptions } from '@nestjs/axios';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [HttpModule],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {
  static register(options: HttpModuleOptions): DynamicModule {
    return {
      module: HttpClientModule,
      imports: [HttpModule.register(options)],
      providers: [HttpClientService],
      exports: [HttpClientService],
    };
  }
}
