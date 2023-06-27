import { DATABASE_CONNECTIONS } from "@aetheria/config";
import { TemplateService } from "@aetheria/models";
import { getConnectionToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "mongoose";
import { AppModule } from "../../../apps/aetheria-backend/src/app/app.module";
import { PluginTailwindClassesBuilderModule } from "./plugin-tailwind-classes-builder.module";
import { PluginTailwindClassesBuilderService } from "./plugin-tailwind-classes-builder.service";

describe("PluginTailwindClassesBuilderService", () => {
	let service: PluginTailwindClassesBuilderService, template_service: TemplateService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule, PluginTailwindClassesBuilderModule],
		}).compile();

		service = module.get<PluginTailwindClassesBuilderService>(PluginTailwindClassesBuilderService);

		template_service = module.get<TemplateService>(TemplateService);
		const connection = module.get<Connection>(getConnectionToken(DATABASE_CONNECTIONS.default));
		await connection.dropDatabase();
	});

	it("compiles tailwindcss minifying css", async () => {
		const template = await template_service.create({
			name: "test",
			html: "<div></div>",
			css: "div { color: red; }",
			project_data: {
				assets: [],
				pages: [],
				styles: [],
			},
		});

		await service.handleTemplateUpdateOrCreation({ document: template });

		expect(template.css).not.toEqual("div { color: red; }");
		expect(template.css).toContain("div{color:red}");
		expect(template.html).toEqual("<body><div></div></body>");
	});

	it("compiles tailwindcss classes", async () => {
		const template = await template_service.create({
			name: "test",
			html: "<div class='text-gray-500 bg-blue-500 shadow-md'></div>",
			css: "div { color: red; }",
			project_data: {
				assets: [],
				pages: [],
				styles: [],
			},
		});

		await service.handleTemplateUpdateOrCreation({ document: template });

		expect(template.css).toContain(".text-gray-500");
		expect(template.css).toContain(".bg-blue-500");
		expect(template.css).toContain(".shadow-md");
	});

	it("minifies html & css", async () => {
		const template = await template_service.create({
			name: "test",
			html: `
				<div>
					<h1>test</h1>
					<span>test span</span>
				</div>
			`,
			css: `
				div {
					color: red;
				}
				h1 {
					color: blue;
					background-color: green;
				}
			`,
			project_data: {
				assets: [],
				pages: [],
				styles: [],
			},
		});

		await service.handleTemplateUpdateOrCreation({ document: template });

		expect(template.css).toContain("div{color:red}h1{background-color:green;color:blue}");
		expect(template.html).toEqual("<body><div><h1>test</h1><span>test span</span></div></body>");
	});

	it("correctly handles js", async () => {
		const template = await template_service.create({
			name: "test",
			html: `
				<div>
					<h1>test</h1>
					<span>test span</span>
					<script>
						console.log("test");
					</script>
					<script>
						alert("test");
					</script>
				</div>
			`,
			css: `
				div {
					color: red;
				}
				h1 {
					color: blue;
					background-color: green;
				}
			`,
			project_data: {
				assets: [],
				pages: [],
				styles: [],
			},
		});

		await service.handleTemplateUpdateOrCreation({ document: template });

		expect(template.css).toContain("div{color:red}h1{background-color:green;color:blue}");
		expect(template.html).toEqual("<body><div><h1>test</h1><span>test span</span></div></body>");
		expect(template.extra.scripts).toEqual(`;console.log("test");alert("test")`);
	});

	it("correctly extracts css from html", async () => {
		const template = await template_service.create({
			name: "test",
			html: `
				<div>
					<h1>test</h1>
					<span>test span</span>
					<style>
						div {
							color: red;
						}
						h1 {
							color: blue;
							background-color: green;
						}
					</style>
				</div>
			`,
			css: `*{}`,
			project_data: {
				assets: [],
				pages: [],
				styles: [],
			},
		});

		await service.handleTemplateUpdateOrCreation({ document: template });

		expect(template.css).toContain("div{color:red}h1{background-color:green;color:blue}");
		expect(template.html).toEqual("<body><div><h1>test</h1><span>test span</span></div></body>");
	});
});
