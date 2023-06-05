import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

type TransformOptions<T> = {
  transformConstructor: ClassConstructor<T>;
  transformOptions?: ClassTransformOptions;
};

type ErrorHandler = (error) => void | never;

type ResponseTransform<T> = (response: AxiosResponse<T>) => T;

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  get<T>(
    request: {
      url: Parameters<HttpService['get']>[0];
      config?: Parameters<HttpService['get']>[1];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.get<T>(request.url, request.config),
      transformOptions,
      errorHandler,
    );
  }

  post<T>(
    request: {
      url: Parameters<HttpService['post']>[0];
      body?: Parameters<HttpService['post']>[1];
      config?: Parameters<HttpService['post']>[2];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.post<T>(request.url, request.body, request.config),
      transformOptions,
      errorHandler,
    );
  }

  put<T>(
    request: {
      url: Parameters<HttpService['put']>[0];
      body: Parameters<HttpService['put']>[1];
      config?: Parameters<HttpService['put']>[2];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.put<T>(request.url, request.body, request.config),
      transformOptions,
      errorHandler,
    );
  }

  delete<T>(
    request: {
      url: Parameters<HttpService['delete']>[0];
      config?: Parameters<HttpService['delete']>[1];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.delete<T>(request.url, request.config),
      transformOptions,
      errorHandler,
    );
  }

  patch<T>(
    request: {
      url: Parameters<HttpService['patch']>[0];
      body: Parameters<HttpService['patch']>[1];
      config?: Parameters<HttpService['patch']>[2];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.patch<T>(request.url, request.body, request.config),
      transformOptions,
      errorHandler,
    );
  }

  head<T>(
    request: {
      url: Parameters<HttpService['head']>[0];
      config?: Parameters<HttpService['head']>[1];
    },
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    return this.requestWrapper(
      this.httpService.head<T>(request.url, request.config),
      transformOptions,
      errorHandler,
    );
  }

  private requestWrapper<T>(
    request: Observable<AxiosResponse<T>>,
    transformOptions?: TransformOptions<T>,
    errorHandler?: ErrorHandler,
  ): Promise<T> {
    const request$ = request.pipe(
      map(HttpClientService.axiosResponseTransform(transformOptions)),
      catchError((err) => {
        errorHandler && errorHandler(err);
        HttpClientService.axiosErrorHandler(err);
      }),
    );
    return firstValueFrom(request$);
  }

  private static axiosResponseTransform<T>(
    transformOptions?: TransformOptions<T>,
  ): ResponseTransform<T> {
    if (!transformOptions) return (response) => response.data;

    return (response: AxiosResponse<T>) =>
      plainToInstance(
        transformOptions.transformConstructor,
        response.data,
        transformOptions.transformOptions,
      );
  }

  private static axiosErrorHandler(error: Error): never {
    if (!(error as AxiosError).isAxiosError) {
      throw new InternalServerErrorException(error.message);
    }

    const axiosError = error as AxiosError;
    const {
      response,
      config: { url },
    } = axiosError;
    const message = `An error occurred while processing your request to ${url}`;
    // Connection error handler
    if (!response) {
      throw new InternalServerErrorException({
        message,
        error: axiosError.message,
      });
    }

    const { status, data } = response;
    throw new HttpException({ message, error: data }, status);
  }
}
