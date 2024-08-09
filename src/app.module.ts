import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        synchronize: true,
        url: configService.get('POSTGRES_URL'),
        autoLoadEntities: true
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Function to determine the environment file path dynamically based on some condition
function getEnvFilePath(): string[] {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'prod':
      return ['.env'];

    case 'test':
      return ['.env.test'];

    case 'dev':
    case 'staging':
    case 'development':
      return ['.env.dev'];

    default:
      return ['.env.dev'];
  }
}