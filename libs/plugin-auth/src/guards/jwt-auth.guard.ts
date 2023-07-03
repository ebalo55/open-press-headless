import { IS_PUBLIC_ENDPOINT_KEY } from "@aetheria/common";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	public override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const is_public = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ENDPOINT_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (is_public) {
			return true;
		}

		return super.canActivate(context);
	}
}
