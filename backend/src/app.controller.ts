import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      message: 'MuneemJee API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
} 