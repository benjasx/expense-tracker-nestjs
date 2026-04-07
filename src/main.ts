import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Control de Gastos API')
    .setDescription(
      'Backend para la gestión financiera personal y reportes estratégicos.',
    )
    .setVersion('1.0')
    .addBearerAuth() // Habilita el botón para pegar el Token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // La URL será: http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Esto hace que el token no se borre al refrescar la página
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API corriendo en: http://localhost:${port}/api`);
  console.log(`📝 Docs disponibles en: http://localhost:3000/api/docs`);
}
bootstrap();
