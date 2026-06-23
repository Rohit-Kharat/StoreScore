import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Rating } from './ratings/entities/rating.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';

// Seeder
import { seedDatabase } from './database/seeder';

@Module({
  imports: [
    // Dynamic config loader
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // TypeORM configuration
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'store_rating_db',
        entities: [User, Store, Rating],
        synchronize: true, // Automatically synchronize DB schema (perfect for testing/assessments)
        keepConnectionAlive: true,
      }),
    }),

    // Features entities for AppService stats
    TypeOrmModule.forFeature([User, Store, Rating]),

    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await seedDatabase(this.dataSource);
    } catch (error) {
      console.error('Failed to run database seeder on startup:', error);
    }
  }
}
