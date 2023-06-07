import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { authConfig } from "@open-press/config";
import { HashService } from "./hash.service";

@Module({
	imports: [ConfigModule.forFeature(authConfig)],
	providers: [HashService],
	exports: [HashService],
})
export class HashModule {}
