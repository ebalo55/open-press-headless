import { AppModule } from "@aetheria/common";
import { AUTH_CONFIG_KEY, AuthConfig } from "@aetheria/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				PassportModule,
				JwtModule.registerAsync({
					inject: [AUTH_CONFIG_KEY],
					useFactory: (auth_config: AuthConfig): JwtModuleOptions => {
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
						} else {
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
				AuthModule,
			],
			providers: [AuthService, LocalStrategy, JwtStrategy],
			controllers: [AuthController],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
