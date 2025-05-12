import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

interface ExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const safeResponse: ExceptionResponse =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as ExceptionResponse)
        : { message: exception.message };

    const responseBody: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof BadRequestException && safeResponse.message
          ? safeResponse.message
          : safeResponse.message || 'Unexpected error occurred',
    };

    response.status(status).json(responseBody);
  }
}
