import { Test, TestingModule } from "@nestjs/testing";
import { PluginTailwindClassesBuilderService } from "./plugin-tailwind-classes-builder.service";

describe("PluginTailwindClassesBuilderService", () => {
	let service: PluginTailwindClassesBuilderService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PluginTailwindClassesBuilderService],
		}).compile();

		service = module.get<PluginTailwindClassesBuilderService>(PluginTailwindClassesBuilderService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
