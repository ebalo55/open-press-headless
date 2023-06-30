/* istanbul ignore file */

import { bootstrap } from "@aetheria/common";

/**
 * Bootstrap the application.
 * The bootstraping logic have been extracted to a separate file to make it easier to test and maintain.
 */
bootstrap({
	enable_native_logging: true,
	enable_error_logging:  true,
});
