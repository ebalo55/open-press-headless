"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_VALIDATION_HOOK = void 0;
/**
 * @description This object contains the hook names that are emitted by the EnvValidation class.
 */
exports.ENV_VALIDATION_HOOK = {
    before_validation: "hook.env.validate.before",
    after_validation: "hook.env.validate.after",
    validate_schema: "hook.env.validate.schema",
    configuration_resolved_files: "hook.env.configuration.resolved-files",
    configuration_loaded_schemas: "hook.env.configuration.loaded-schemas",
};
