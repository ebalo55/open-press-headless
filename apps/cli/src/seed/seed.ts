import { UserDocument, UserService } from "@open-press/models";
import * as Listr from "listr";
import { Command, CommandRunner, Option } from "nest-commander";
import { z } from "zod";
import { makeLogger } from "../logger";

interface SeedParams {
	email: string;
	name: string;
	password: string;
}

interface TasksContext extends SeedParams {
	user?: UserDocument | null;
}

@Command({
	name: "seed",
	description: "Seed the database",
})
export class Seed extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor(private readonly user_service: UserService) {
		super();
		this.logger = makeLogger("Seed");
	}

	/**
	 * Parse the email option
	 * @param {string} email
	 * @returns {string}
	 */
	@Option({
		flags: "-e, --email <email>",
		description: "Email of the user",
		required: true,
		defaultValue: "john.doe@example.com",
	})
	public parseEmail(email: string) {
		const result = z.string().email().safeParse(email);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	/**
	 * Parse the name option
	 * @param {string} name
	 * @returns {string}
	 */
	@Option({
		flags: "-n, --name <name>",
		description: "Name of the user",
		required: true,
		defaultValue: "John Doe",
	})
	public parseName(name: string) {
		const result = z.string().min(3).safeParse(name);
		if (result.success) {
			return result.data;
		}

		throw new Error(result.error.message);
	}

	/**
	 * Parse the password option
	 * @param {string} password
	 * @returns {string}
	 */
	@Option({
		flags: "-p, --password <password>",
		description: "Password of the user",
		required: true,
		defaultValue: "password",
	})
	public parsePassword(password: string) {
		const result = z.string().min(8).safeParse(password);
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

		if (!ctx.user) {
			this.logger.error("Failed to create user");
			throw new Error("Failed to create user");
		}

		this.logger.info(`Created user ${ctx.user.email} with id ${ctx.user.id}`);
		this.logger.info("Seeding completed successfully");
	}

	/**
	 * Build the tasks to run
	 * @returns {Listr<TasksContext>}
	 * @private
	 */
	private buildTasks() {
		return new Listr<TasksContext>([
			{
				title: "Checking user existence",
				task: async (ctx, task) => {
					try {
						const admin = await this.user_service.findByEmail(ctx.email);
						if (admin) {
							task.skip("User already exists");
							ctx.user = admin;
						}
					} catch (e) {
						ctx.user = null;
					}
				},
			},
			{
				title: "Creating user",
				skip: (ctx) => {
					if (ctx.user) {
						return "User already exists";
					}
				},
				task: async (ctx) => {
					ctx.user = await this.user_service.create({
						email: ctx.email,
						password: ctx.password,
						name: ctx.name,
					});
				},
			},
		]);
	}
}
