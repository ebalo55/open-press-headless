import {
	authConfig,
	DATABASE_CONFIG_KEY,
	DATABASE_CONNECTIONS,
	databaseConfig,
	DatabaseConfig,
	EnvValidation,
} from "@aetheria/config";
import { TemplateModule } from "@aetheria/models";
import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards";

@Module({
	imports: [
		EventEmitterModule.forRoot({
			global: true,
			delimiter: ".",
			maxListeners: 0,
			wildcard: true,
			newListener: true,
			removeListener: true,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			load: [databaseConfig, authConfig],
			validate: (config: Record<string, any>) => EnvValidation.instance.validateEnv(config),
		}),
		MongooseModule.forRootAsync({
			inject: [DATABASE_CONFIG_KEY],
			useFactory: async (db_config: DatabaseConfig): Promise<MongooseModuleFactoryOptions> => {
				return {
					dbName: db_config[DATABASE_CONNECTIONS.default].database,
					uri:
						`mongodb://` +
						`${db_config[DATABASE_CONNECTIONS.default].username}:` +
						`${db_config[DATABASE_CONNECTIONS.default].password}@` +
						`${db_config[DATABASE_CONNECTIONS.default].host}:` +
						`${db_config[DATABASE_CONNECTIONS.default].port}/`,
				};
			},
			connectionName: DATABASE_CONNECTIONS.default,
		}),
		AuthModule,
		TemplateModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
	exports: [AuthModule, TemplateModule],
})
export class AppModule {}
