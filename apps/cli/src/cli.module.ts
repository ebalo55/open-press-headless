import { Module } from "@nestjs/common";
import { AppModule } from "../../open-press-backend/src/app/app.module";
import { Build } from "./build/build";
import { Seed } from "./seed/seed";

@Module({
	imports: [AppModule],
	providers: [Seed, Build],
})
export class CliModule {}
