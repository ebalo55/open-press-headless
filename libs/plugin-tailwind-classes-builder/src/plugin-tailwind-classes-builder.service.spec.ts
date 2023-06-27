import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../../apps/aetheria-backend/src/app/app.module";
import { PluginTailwindClassesBuilderService } from "./plugin-tailwind-classes-builder.service";

describe("PluginTailwindClassesBuilderService", () => {
	let service: PluginTailwindClassesBuilderService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PluginTailwindClassesBuilderService],
		}).compile();

		service = module.get<PluginTailwindClassesBuilderService>(PluginTailwindClassesBuilderService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
