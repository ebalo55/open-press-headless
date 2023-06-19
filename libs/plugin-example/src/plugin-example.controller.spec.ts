import { Test } from "@nestjs/testing";
import { PluginExampleController } from "./plugin-example.controller";
import { PluginExampleService } from "./plugin-example.service";

describe("ExamplePluginController", () => {
	let controller: PluginExampleController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [PluginExampleService],
			controllers: [PluginExampleService],
		}).compile();

		controller = module.get(PluginExampleController);
	});

	it("should be defined", () => {
		expect(controller).toBeTruthy();
	});
});
