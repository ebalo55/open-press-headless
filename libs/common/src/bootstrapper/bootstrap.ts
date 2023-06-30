import { BootstrapOptions } from "@aetheria/backend-interfaces";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { INestApplicationContext, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules";
import { makeRootModule } from "./root-module-factory";

/**
 * Bootstraps the application.
 * @param configuration The configuration to use.
 * @returns {Promise<INestApplicationContext>} The application context.
 */
export async function bootstrap(configuration?: BootstrapOptions) {
	if (configuration && configuration.runas_cli) {
		return await NestFactory.createApplicationContext((await makeRootModule(AppModule, configuration)) as any, {
			logger: configuration.enable_native_logging ? new Logger() : false,
		});
	}

	if (configuration?.enable_native_logging) {
		Logger.log("🚀 Bootstrapping application...");
	}

	const app = await NestFactory.create(await makeRootModule(AppModule, configuration), {
		logger: configuration && configuration.enable_native_logging ? new Logger() : false,
	});
	app.enableCors({
		credentials: true,
		origin: "*",
		methods: "*",
		allowedHeaders: "*",
		preflightContinue: false,
		exposedHeaders: "*",
		optionsSuccessStatus: 201,
		maxAge: 60000,
	});

	app.enableShutdownHooks();

	const port = process.env.PORT || 3000;
	await app.listen(port);

	if (configuration?.enable_native_logging) {
		Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
	}

	return app;
}
