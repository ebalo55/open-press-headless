import { BaseError, BaseErrorType } from "@aetheria/support";

/**
 * Error thrown when a template name is already used.
 */
@BaseError
export class TemplateNotFoundError extends Error {
	constructor() {
		super("Template not found.");
	}
}

/**
 * Factory for TemplateNotFoundError
 * @type {BaseErrorType<TemplateNotFoundError>}
 */
export const TemplateNotFoundErrorFactory = TemplateNotFoundError as BaseErrorType<TemplateNotFoundError>;
