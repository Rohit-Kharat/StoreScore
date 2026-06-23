"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./users/entities/user.entity");
const store_entity_1 = require("./stores/entities/store.entity");
const rating_entity_1 = require("./ratings/entities/rating.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const stores_module_1 = require("./stores/stores.module");
const ratings_module_1 = require("./ratings/ratings.module");
const seeder_1 = require("./database/seeder");
let AppModule = class AppModule {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        try {
            await (0, seeder_1.seedDatabase)(this.dataSource);
        }
        catch (error) {
            console.error('Failed to run database seeder on startup:', error);
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '3306', 10),
                    username: process.env.DB_USERNAME || 'root',
                    password: process.env.DB_PASSWORD || '',
                    database: process.env.DB_DATABASE || 'store_rating_db',
                    entities: [user_entity_1.User, store_entity_1.Store, rating_entity_1.Rating],
                    synchronize: true,
                    keepConnectionAlive: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, store_entity_1.Store, rating_entity_1.Rating]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            stores_module_1.StoresModule,
            ratings_module_1.RatingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
//# sourceMappingURL=app.module.js.map