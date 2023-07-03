import { Test } from "@nestjs/testing";
import { PluginExampleService } from "./plugin-example.service";

describe("ExamplePluginService", () => {
	let service: PluginExampleService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [PluginExampleService],
		}).compile();

		service = module.get(PluginExampleService);
	});

	it("returns example value", async () => {
		expect(await service.exampleMethod()).toEqual({ example: "example-value" });
	});
});
