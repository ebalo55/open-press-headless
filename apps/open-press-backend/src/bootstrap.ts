import { Logger, ModuleMetadata, Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { readFile } from "node:fs/promises";
import { AppModule } from "./app/app.module";
import { PluginLoaderModule } from "./app/plugin-loader/plugin-loader.module";

interface OpenPressConfig {
	plugins: string[];
}

/**
 * Creates the plugin wrapped root module for the application.
 * @param {Type} root_module The root module of the application.
 * @returns {Promise<DynamicModule>} The plugin wrapped root module.
 */
async function makeRootModule(root_module: Type) {
	const imports: ModuleMetadata["imports"] = [root_module];

	await registerPlugins(imports);
	return PluginLoaderModule.forModule(imports);
}

/**
 * Reads the OpenPress configuration file.
 * @param {string} config_filename The path to the OpenPress configuration file.
 * @returns {Promise<OpenPressConfig>} The OpenPress configuration.
 */
async function readConfig(config_filename: string) {
	return JSON.parse(await readFile(config_filename, "utf-8")) as OpenPressConfig;
}

/**
 * Registers the plugins specified in the OpenPress configuration file.
 * @param {NonNullable<ModuleMetadata["imports"]>} imports The imports array of the root module.
 * @returns {Promise<void>} A promise that resolves when all plugins have been registered.
 */
async function registerPlugins(imports: NonNullable<ModuleMetadata["imports"]>) {
	const config_filename = "open-press.json";
	const config = await readConfig(config_filename);

	const plugins = await Promise.all(
		config.plugins.map((plugin_name) => {
			const path = require.resolve(plugin_name, {
				paths: [process.cwd()],
			});

			return import(path);
		})
	);

	const plugin_modules = plugins
		.map((plugin) => {
			return plugin.default;
		})
		.filter(Boolean);
	imports.push(...plugin_modules);
}

/**
 * Bootstraps the application.
 * @returns {Promise<void>} A promise that resolves when the application has been bootstrapped.
 */
export async function bootstrap() {
	Logger.log("🚀 Bootstrapping application...");
	const app = await NestFactory.create(await makeRootModule(AppModule));
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

	const port = process.env.PORT || 3000;
	await app.listen(port);

	Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}
