import { CommandRunner, SubCommand } from "nest-commander";
import { makeLogger } from "../logger";

@SubCommand({
	name: "install",
	description: "Build the application plugins",
})
export class PluginSubInstall extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	public async run(passedParams: string[], options?: Record<string, any>) {
		this.logger.info("Plugin subcommand install");
	}
}
