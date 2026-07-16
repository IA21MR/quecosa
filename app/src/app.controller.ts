import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'SOTEK Platform Public API',
      projectType: 'public_website',
      projectName: 'quecosa',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      projectType: 'public_website',
    };
  }
}
