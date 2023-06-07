"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = exports.AUTH_CONFIG_KEY = exports.authConfig = void 0;
var config_1 = require("@nestjs/config");
var process = require("process");
var zod_1 = require("zod");
/* istanbul ignore file */
exports.authConfig = (0, config_1.registerAs)("auth", function () {
    var _a, _b;
    return ({
        hashing: {
            algorithm: "bcrypt",
            iterations: +(process.env["BCRYPT_HASHING_ITERATION"] || "10"),
            version: ((_a = process.env["BCRYPT_ALGORITHM_VERSION"]) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith("a")) ? "a" : "b",
        },
        jwt: {
            encryption: ((_b = process.env["JWT_ENCRYPTION"]) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "asymmetric" ? "asymmetric" : "symmetric",
            secret: process.env["JWT_SECRET"],
            public_key: process.env["JWT_PUBLIC_KEY"],
            private_key: process.env["JWT_PRIVATE_KEY"],
            algorithm: process.env["JWT_ALGORITHM"] || "HS512",
            audience: process.env["JWT_AUDIENCE"] || "open-press",
            expires_in: process.env["JWT_EXPIRES_IN"] || "2h",
            issuer: process.env["JWT_ISSUER"] || "open-press",
        },
    });
});
/**
 * @description This is the type of the config object that will be injected in modules.
 * @example
 * constructor(
 *   \@Inject(AUTH_CONFIG_KEY)
 *   private dbConfig: AuthConfig,
 * ) {}
 */
exports.AUTH_CONFIG_KEY = exports.authConfig.KEY;
/**
 * @description This is the validation schema that will be used to validate the environment.
 */
exports.validationSchema = zod_1.z
    .object({
    BCRYPT_HASHING_ITERATION: zod_1.z.number().min(1).optional(),
    BCRYPT_ALGORITHM_VERSION: zod_1.z.enum(["a", "b"]).optional(),
    JWT_ENCRYPTION: zod_1.z.enum(["symmetric", "asymmetric"]),
    JWT_SECRET: zod_1.z.string().optional(),
    JWT_PUBLIC_KEY: zod_1.z.string().optional(),
    JWT_PRIVATE_KEY: zod_1.z.string().optional(),
    JWT_ALGORITHM: zod_1.z
        .enum([
        "HS256",
        "HS384",
        "HS512",
        "RS256",
        "RS384",
        "RS512",
        "ES256",
        "ES384",
        "ES512",
        "PS256",
        "PS384",
        "PS512",
    ])
        .optional(),
    JWT_AUDIENCE: zod_1.z.string().optional(),
    JWT_EXPIRES_IN: zod_1.z.string().optional(),
    JWT_ISSUER: zod_1.z.string().optional(),
})
    .superRefine(function (obj, ctx) {
    if (obj.JWT_ENCRYPTION !== "asymmetric") {
        return false;
    }
    if (!obj.JWT_PUBLIC_KEY || !obj.JWT_PRIVATE_KEY) {
        ctx.addIssue({
            code: "invalid_type",
            message: "You must provide a public and private key for asymmetric encryption.",
            path: ["JWT_PUBLIC_KEY", "JWT_PRIVATE_KEY"],
            expected: "string",
            received: "undefined",
        });
        return false;
    }
    return true;
})
    .superRefine(function (obj, ctx) {
    if (obj.JWT_ENCRYPTION !== "symmetric") {
        return false;
    }
    if (!obj.JWT_SECRET) {
        ctx.addIssue({
            code: "invalid_type",
            message: "You must provide a secret for symmetric encryption.",
            path: ["JWT_SECRET"],
            expected: "string",
            received: "undefined",
        });
        return false;
    }
    return true;
});
