import { getPlugins } from "@aetheria/config";

describe("getPlugins", () => {
	it("should return the configuration", async () => {
		const plugins = await getPlugins();

		expect(plugins).toBeDefined();
		expect(plugins.length).toBeGreaterThan(0);
	});
});
