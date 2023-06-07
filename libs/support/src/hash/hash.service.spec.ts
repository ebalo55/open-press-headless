import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { authConfig } from "@open-press/config";
import { HashService } from "./hash.service";

describe("HashService", () => {
	let service: HashService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forFeature(authConfig)],
			providers: [HashService],
		}).compile();

		service = module.get<HashService>(HashService);
	});

	it("can hash a password", async () => {
		expect(await service.make("test")).toMatch(/^\$2[ayb]\$.{56}$/);
	});

	it("can compare a password", async () => {
		const hash = await service.make("test");
		expect(await service.compare("test", hash)).toBeTruthy();
	});
});
