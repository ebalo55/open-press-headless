import { authConfig } from "@aetheria/config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HashService } from "./hash.service";

@Module({
	imports: [ConfigModule.forFeature(authConfig)],
	providers: [HashService],
	exports: [HashService],
})
export class HashModule {}
