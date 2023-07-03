import { getPlugins, resolvePlugin } from "@aetheria/config";

describe("resolvePlugin", () => {
	it("should return the configuration", async () => {
		const plugins = await getPlugins();

		await Promise.all(
			plugins.map(async (plugin) => {
				const resolvedPlugin = await resolvePlugin(plugin);

				expect(resolvedPlugin).toBeDefined();
				expect(resolvedPlugin.name).toBe(plugin.id);
			})
		);
	});
});
