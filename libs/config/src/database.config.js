"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = exports.DATABASE_CONFIG_KEY = exports.DATABASE_CONNECTIONS = exports.databaseConfig = void 0;
var config_1 = require("@nestjs/config");
var zod_1 = require("zod");
/* istanbul ignore file */
/**
 * @description This is the callback that will be used to load the config object in the ConfigModule.
 * @example
 * ConfigModule.forRoot({
 *      isGlobal: true,
 *      load: [
 *          databaseConfig,
 *      ]
 * })
 * @type {(() => IDatabaseConfig) & ConfigFactoryKeyHost<ReturnType<() => IDatabaseConfig>>}
 */
exports.databaseConfig = (0, config_1.registerAs)("database", function () {
    var _a;
    return (_a = {},
        _a[exports.DATABASE_CONNECTIONS.default] = {
            host: process.env["DB_HOST"],
            port: +(process.env["DB_PORT"] || "27017"),
            username: process.env["DB_USERNAME"],
            password: process.env["DB_PASSWORD"],
            database: process.env["DB_DATABASE"],
        },
        _a);
});
exports.DATABASE_CONNECTIONS = {
    default: "default",
};
/**
 * @description This is the key that will be used to inject the config object in modules.
 * @example
 * constructor(
 *   \@Inject(DATABASE_CONFIG_KEY)
 *   private dbConfig: DatabaseConfig,
 * ) {}
 * @type {string}
 */
exports.DATABASE_CONFIG_KEY = exports.databaseConfig.KEY;
/**
 * @description This is the validation schema that will be used to validate the environment.
 */
exports.validationSchema = zod_1.z.object({
    DB_HOST: zod_1.z.string().min(1),
    DB_PORT: zod_1.z.coerce.number().min(1024).max(65535).optional(),
    DB_USERNAME: zod_1.z.string().min(1),
    DB_PASSWORD: zod_1.z.string().min(1),
    DB_DATABASE: zod_1.z.string().min(1),
});
