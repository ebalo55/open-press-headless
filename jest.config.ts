import type { Config } from "jest";

const config: Config = {
	roots: ["<rootDir>/apps/", "<rootDir>/libs/"],
	maxWorkers: 1,
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: ".",
	testRegex: ".*\\.(spec|e2e-spec)\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.[tj]s", "!apps/cli/**/*.[tj]s", "!libs/interfaces/**/*.[tj]s", "!**/index.ts"],
	coverageDirectory: "./coverage",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@aetheria/config(|/.*)$": "<rootDir>/libs/config/src/$1",
		"^@aetheria/plugin-example(|/.*)$": "<rootDir>/libs/plugin-example/src/$1",
		"^@aetheria/models(|/.*)$": "<rootDir>/libs/models/src/$1",
		"^@aetheria/support(|/.*)$": "<rootDir>/libs/support/src/$1",
		"^@aetheria/utility(|/.*)$": "<rootDir>/libs/utility/src/$1",
		"^@aetheria/backend-interfaces(|/.*)$": "<rootDir>/libs/interfaces/src/$1",
	},
};

export default config;
