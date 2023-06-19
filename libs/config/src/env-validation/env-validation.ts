import { safeValidate } from "@open-press/utility";
import { readdirSync } from "fs";
import { resolve } from "path";
import { ZodSchema } from "zod";

/**
 * @description This class is responsible for validating the environment variables.
 */
export class EnvValidation {
	private static _instance: EnvValidation;
	private _config_file_filters: RegExp[] = [];
	private _resolution_paths: string[] = [];

	private constructor() {
		this.addConfigFileFilters([/\.config\.(ts|js)$/]);

		this.addResolutionPaths([__dirname, resolve(__dirname, "..")]);
	}

	/**
	 * @description This is the singleton instance of the EnvValidation class.
	 * @returns {EnvValidation} The singleton instance of the EnvValidation class.
	 */
	public static get instance(): EnvValidation {
		if (!EnvValidation._instance) {
			EnvValidation._instance = new EnvValidation();
		}

		return EnvValidation._instance;
	}

	/**
	 * Accessor to the list of file filters.
	 * @returns {RegExp[]}
	 */
	public get configFileFilters(): RegExp[] {
		return this._config_file_filters;
	}

	/**
	 * Accessor to the list of resolution paths.
	 * @returns {string[]}
	 */
	public get resolutionPaths(): string[] {
		return this._resolution_paths;
	}

	/**
	 * @description Add a resolution path to the list of path loading validation schemas.
	 * @param {string} path The path to add.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public addResolutionPath(path: string): EnvValidation {
		this._resolution_paths.push(path);
		return this;
	}

	/**
	 * @description Add a resolution path to the list of path loading validation schemas.
	 * @param {string[]} paths The paths to add.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public addResolutionPaths(paths: string[]): EnvValidation {
		paths.forEach((path) => this.addResolutionPath(path));
		return this;
	}

	/**
	 * @description Remove a resolution path from the list of path loading validation schemas.
	 * @param {string} path The path to remove.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public removeResolutionPath(path: string): EnvValidation {
		this._resolution_paths = this._resolution_paths.filter((p) => p !== path);
		return this;
	}

	public clearResolutionPaths(): EnvValidation {
		this._resolution_paths = [];
		return this;
	}

	/**
	 * @description This function will add a config file filter.
	 * @param {RegExp} filter The filter to add.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public addConfigFileFilter(filter: RegExp): EnvValidation {
		this._config_file_filters.push(filter);
		return this;
	}

	/**
	 * @description This function will add a config file filter.
	 * @param filters The filters to add.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public addConfigFileFilters(filters: RegExp[]): EnvValidation {
		filters.forEach((filter) => this.addConfigFileFilter(filter));
		return this;
	}

	/**
	 * @description This function will remove a config file filter.
	 * @param {RegExp} filter The filter to remove.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public removeConfigFileFilter(filter: RegExp): EnvValidation {
		this._config_file_filters = this._config_file_filters.filter((f) => f.source !== filter.source);
		return this;
	}

	/**
	 * @description This function will clear all config file filters.
	 * @returns {EnvValidation} The EnvValidation instance.
	 */
	public clearConfigFileFilters(): EnvValidation {
		this._config_file_filters = [];
		return this;
	}

	/**
	 * @description This function will validate the environment variables against the list of validation schema
	 *     provided in each configuration file.
	 * @param {Record<string, unknown>} config
	 * @returns {Record<string, unknown>}
	 */
	public validateEnv(config: Record<string, any>): Record<string, unknown> {
		this.resolveConfigValidationSchema().forEach((schema) => {
			// validate the config object against the validation schema
			const result = safeValidate(config, schema);

			// if an error was found, re-throw it
			if (!result.success) {
				throw new Error(`Config validation error: ${(result as any).error.message}`);
			}
		});

		// return the validated config object if no error was found
		return config;
	}

	/**
	 * @description This function will resolve the validation schema from each configuration file.
	 * @example
	 * import { z } from "zod";
	 * export const validationSchema = z.object({
	 * 	   DB_HOST:     z.string().min(1),
	 * 	   DB_PORT:     z.number().min(1024).max(65535),
	 * 	   DB_USERNAME: z.string().min(1),
	 * 	   DB_PASSWORD: z.string().min(1),
	 * 	   DB_DATABASE: z.string().min(1),
	 * });
	 * @returns {ZodSchema[]} The list of validation schemas.
	 */
	private resolveConfigValidationSchema(): ZodSchema[] {
		return this._resolution_paths
			.map((path) => {
				const cwd = resolve(path);
				const config_files = readdirSync(cwd).filter((value) => this.passesConfigFileFilters(value));

				return config_files
					.map((file) => require(resolve(cwd, file)))
					.map((config) => config.validationSchema || null)
					.filter((schema) => schema !== null) as ZodSchema[];
			})
			.flat();
	}

	/**
	 * @description This function will check if the file passes the config file filters.
	 * @param {string} file The file to check.
	 * @returns {boolean} True if the file passes the config file filters, false otherwise.
	 * @private
	 */
	private passesConfigFileFilters(file: string): boolean {
		return this._config_file_filters.some((filter) => filter.test(file));
	}
}
