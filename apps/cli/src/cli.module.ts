import { AppModule } from "@aetheria/common";
import { forwardRef, Module } from "@nestjs/common";
import { PluginBase } from "./plugin/base";
import { Seed } from "./seed/seed";

@Module({
	imports: [forwardRef(() => AppModule)],
	providers: [Seed, ...PluginBase.registerWithSubCommands()],
})
export class CliModule {}
