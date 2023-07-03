import { AppModule } from "@aetheria/common";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import axios from "axios";
import { PluginExampleModule } from "./plugin-example.module";

describe("ExamplePluginController", () => {
	let app: INestApplication, url: string;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [AppModule, PluginExampleModule],
		}).compile();

		app = module.createNestApplication();
		await app.listen(3001);
		url = await app.getUrl();
	});

	it("should be defined", async () => {
		const response = await axios.get(`${url}/plugin-example`);
		expect(response.data).toEqual({ example: "example-value" });
	});
});
