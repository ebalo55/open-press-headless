import { Module } from "@nestjs/common";
import { AppModule } from "../../aetheria-backend/src/app/app.module";
import { PluginBase } from "./plugin/base";
import { Seed } from "./seed/seed";

@Module({
	imports: [AppModule],
	providers: [Seed, ...PluginBase.registerWithSubCommands()],
})
export class CliModule {}
