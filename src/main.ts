import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:'*'});
  //Global Validation Middleware
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }));
  //Default versioning i.e    => api/v1/user
  app.setGlobalPrefix('v1');
  await app.listen(process.env.PORT);
}
bootstrap();
