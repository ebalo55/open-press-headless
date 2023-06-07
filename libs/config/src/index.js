"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = exports.AUTH_CONFIG_KEY = exports.DATABASE_CONNECTIONS = exports.databaseConfig = exports.DATABASE_CONFIG_KEY = void 0;
var database_config_ts_1 = require("./database.config.ts");
Object.defineProperty(exports, "DATABASE_CONFIG_KEY", { enumerable: true, get: function () { return database_config_ts_1.DATABASE_CONFIG_KEY; } });
Object.defineProperty(exports, "databaseConfig", { enumerable: true, get: function () { return database_config_ts_1.databaseConfig; } });
Object.defineProperty(exports, "DATABASE_CONNECTIONS", { enumerable: true, get: function () { return database_config_ts_1.DATABASE_CONNECTIONS; } });
var auth_config_ts_1 = require("./auth.config.ts");
Object.defineProperty(exports, "AUTH_CONFIG_KEY", { enumerable: true, get: function () { return auth_config_ts_1.AUTH_CONFIG_KEY; } });
Object.defineProperty(exports, "authConfig", { enumerable: true, get: function () { return auth_config_ts_1.authConfig; } });
__exportStar(require("./env-validation.ts"), exports);
