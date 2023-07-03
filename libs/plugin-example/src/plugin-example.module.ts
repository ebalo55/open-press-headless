import { Module } from "@nestjs/common";
import { PluginExampleController } from "./plugin-example.controller";
import { PluginExampleService } from "./plugin-example.service";

@Module({
	controllers: [PluginExampleController],
	providers: [PluginExampleService],
	exports: [PluginExampleService],
})
export class PluginExampleModule {}
