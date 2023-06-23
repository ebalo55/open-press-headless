import { AUTH_CONFIG_KEY, AuthConfig } from "@aetheria/config";
import { UserModelModule } from "@aetheria/models";
import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies";

@Module({
	imports: [
		UserModelModule,
		PassportModule,
		JwtModule.registerAsync({
			inject: [AUTH_CONFIG_KEY],
			useFactory: (auth_config: AuthConfig): JwtModuleOptions => {
				// If the encryption is symmetric, then we use the secret key.
				if (auth_config.jwt.encryption === "symmetric") {
					return {
						secret: auth_config.jwt.secret,
						signOptions: {
							audience: auth_config.jwt.audience,
							expiresIn: auth_config.jwt.expires_in,
							issuer: auth_config.jwt.issuer,
							algorithm: auth_config.jwt.algorithm,
						},
					};
				}
				// If the encryption is asymmetric, then we use the public and private keys.
				else {
					return {
						publicKey: auth_config.jwt.public_key,
						privateKey: auth_config.jwt.private_key,
						signOptions: {
							audience: auth_config.jwt.audience,
							expiresIn: auth_config.jwt.expires_in,
							issuer: auth_config.jwt.issuer,
							algorithm: auth_config.jwt.algorithm,
						},
					};
				}
			},
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
	exports: [UserModelModule, AuthService],
})
export class AuthModule {}
