import { DATABASE_CONNECTIONS } from "@aetheria/config";
import { HashModule } from "@aetheria/support";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{
					name: User.name,
					schema: UserSchema,
				},
			],
			DATABASE_CONNECTIONS.default
		),
		HashModule,
	],
	providers: [UserService],
	exports: [UserService],
})
export class UserModelModule {}
