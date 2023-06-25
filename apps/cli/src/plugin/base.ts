import { Command, CommandRunner } from "nest-commander";
import { makeLogger } from "../logger";
import { PluginSubInstall } from "./install";
import { PluginSubList } from "./list";
import { PluginSubBuild } from "./build";

@Command({
	name: "plugin",
	description: "Interact with application plugins",
	subCommands: [PluginSubList, PluginSubInstall, PluginSubBuild],
})
export class PluginBase extends CommandRunner {
	private logger: ReturnType<typeof makeLogger>;

	constructor() {
		super();
		this.logger = makeLogger("Build");
	}

	public async run(passedParams: string[], options?: Record<string, any>) {
		this.command.help();
	}
}
