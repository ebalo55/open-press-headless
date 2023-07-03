import { randomBytes } from "node:crypto";

/**
 * Creates a random string of doubled the given length.
 * @param {number} length
 * @returns {string}
 */
export const makeRandomString = (length: number): string => {
	return randomBytes(length).toString("hex");
};
