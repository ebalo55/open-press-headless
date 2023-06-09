import { Module } from "@nestjs/common";
import { AppModule } from "../../open-press-backend/src/app/app.module";
import { Seed } from "./seed/seed";

@Module({
	imports: [AppModule],
	providers: [Seed],
})
export class CliModule {}
