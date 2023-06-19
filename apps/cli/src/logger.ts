import { createLogger, format, transports } from "winston";

const custom_format = format.printf((data) => {
	const { level } = data;
	return `[${level}] [${data.label.toLowerCase()}] [${data.timestamp}]: ${data.message}`;
});

/**
 * Winston logger factory for the CLI
 * @param {string} label
 * @returns {winston.Logger}
 */
export const makeLogger = (label: string) => {
	return createLogger({
		level: "info",
		transports: [
			new transports.Console({
				format: format.combine(
					format.colorize(),
					format.label({ label }),
					format.timestamp({ format: "DD-MM-YYYY HH:mm:ss.SSS" }),
					custom_format
				),
			}),
		],
	});
};
