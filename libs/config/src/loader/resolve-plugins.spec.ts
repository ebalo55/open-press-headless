import { getConfiguration, resolvePlugins } from "@aetheria/config";

describe("resolvePlugins", () => {
	it("should return the configuration", async () => {
		const configuration = await getConfiguration();

		const resolved_plugins = await resolvePlugins(configuration);

		expect(resolved_plugins).toBeDefined();
		expect(resolved_plugins.length).toBeGreaterThan(0);

		for (const [i, plugin] of resolved_plugins.entries()) {
			expect(configuration.plugins[i].id).toEqual(plugin.name);
		}
	});
});
