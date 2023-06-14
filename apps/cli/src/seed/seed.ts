import { TemplateService, UserService } from "@open-press/models";
import * as Listr from "listr";
import { ListrTaskResult } from "listr";
import { Command, CommandRunner, Option } from "nest-commander";
import { z } from "zod";
import { makeLogger } from "../logger";
import { readFile } from "node:fs/promises";
import { Observable, Subscriber } from "rxjs";
import { LogEntry } from "winston";

interface SeedParams {
	seed: string;
}

interface SeedFile {
	$schema: string;
	items: {
		type: string;
		[x: string]: any;
	}[];
}

interface TasksContext extends SeedParams {
	raw_seed?: string;
	parsed_seed?: SeedFile;
}

@Command({
	name: "seed",
	description: "Seed the database",
})
export class Seed extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;
	private ending_logs: LogEntry[] = [];

	constructor(private readonly user_service: UserService, private readonly template_service: TemplateService) {
		super();
		this.logger = makeLogger("Seed");
	}

	/**
	 * Parse the seed option
	 * @returns {string}
	 * @param seed_file
	 */
	@Option({
		flags: "-s, --seed <seeder-file>",
		description: "JSON file to seed the database with",
		required: true,
		defaultValue: "open-press.seed.json",
	})
	public parseSeedConfig(seed_file: string) {
		const result = z.string().nonempty().safeParse(seed_file);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	/**
	 * Run the command
	 * @param {string[]} passedParams
	 * @param {SeedParams} options
	 * @returns {Promise<void>}
	 */
	public async run(passedParams: string[], options?: SeedParams) {
		this.logger.info("Starting seed process");

		const ctx = await this.buildTasks().run(options);

		this.ending_logs.forEach((log) => {
			this.logger.log(log);
		});

		this.logger.info("Seeding completed successfully");
	}

	/**
	 * Seed templates
	 * @param configuration - The configuration for the task
	 * @private
	 */
	private async seedTemplates(configuration: { subscriber: Subscriber<any>; ctx: TasksContext; item: any }) {
		const { subscriber, ctx, item } = configuration;

		try {
			const template = await this.template_service.findByName(item.name);

			// If the user already exists, skip
			if (template) {
				subscriber.next(`Template '${item.name}' already exists, skipping.`);
				this.ending_logs.push({
					level: "warn",
					message: `Template '${item.name}' already exists, skipped.,
				});

				return;
			}
		} catch (e: any) {
			if (e.message === "Template not found.") {
				const created_template = await this.template_service.create({
					name: item.name,
					html: item.html,
					css: item.cs,
				});

				this.ending_logs.push({
					level: "info",
					message: `Created template '${created_template.name}' with id '${created_template.id}'.,
				});

				return;
			}

			throw e;
		}
	}

	/**
	 * Seed users
	 * @param configuration - The configuration for the task
	 * @private
	 */
	private async seedUsers(configuration: { subscriber: Subscriber<any>; ctx: TasksContext; item: any }) {
		const { subscriber, ctx, item } = configuration;

		try {
			const user = await this.user_service.findByEmail(item.email);

			// If the user already exists, skip
			if (user) {
				subscriber.next(`User '${item.email}' already exists, skipping.`);
				this.ending_logs.push({
					level: "warn",
					message: `User '${item.email}' already exists, skipped.,
				});

				return;
			}
		} catch (e: any) {
			if (e.message === "User not found") {
				const created_user = await this.user_service.create({
					email: item.email,
					password: item.password,
					name: item.nam,
				});

				this.ending_logs.push({
					level: "info",
					message: `Created user '${created_user.email}' with id '${created_user.id}'.,
				});

				return;
			}

			throw e;
		}
	}

	/**
	 * Seed the database
	 * @param subscriber - The subscriber to send logs to
	 * @param ctx - The tasks context
	 * @private
	 */
	private async seed(subscriber: Subscriber<any>, ctx: TasksContext) {
		const { parsed_seed } = ctx;
		if (!parsed_seed) {
			throw new Error("No seed file found");
		}

		const { items } = parsed_seed;

		for (const [index, item] of items.entries()) {
			subscriber.next(`Seeding ${item.type} at index ${index}`);
			if (item.type === "template") {
				await this.seedTemplates({
					subscriber,
					ctx,
					ite,
				});
			} else if (item.type === "user") {
				await this.seedUsers({
					subscriber,
					ctx,
					ite,
				});
			}
		}
	}

	/**
	 * Build the tasks to run
	 * @returns {Listr<TasksContext>}
	 * @private
	 */
	private buildTasks() {
		return new Listr<TasksContext>([
			{
				title: "Checking seed file existence",
				task: async (ctx, task) => {
					const content = await readFile(ctx.seed, "utf-8");

					ctx.raw_seed = content;
				}
			},
			{
				title: "Parsing seed file",
				task: async (ctx, task) => {
					if (!ctx.raw_seed) {
						throw new Error("No seed file found");
					}

					ctx.parsed_seed = JSON.parse(ctx.raw_seed);
				}
			},
			{
				title: "Seeding",
				task: (ctx, task) => {
					return new Observable((subscriber) => {
						this.seed(subscriber, ctx)
							.then(() => {
								subscriber.complete();
							})
							.catch((e) => {
								console.error(e);
								subscriber.error(e.message);
							});
					}) as unknown as ListrTaskResult<any>;
				}
			}
		]);
	}
}
