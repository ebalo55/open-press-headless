import { getConfiguration } from "@aetheria/config";

describe("getConfiguration", () => {
	it("should return the configuration", async () => {
		const configuration = await getConfiguration();

		expect(configuration.plugins).toBeDefined();
		expect(configuration.plugins.length).toBeGreaterThan(0);
	});
});
