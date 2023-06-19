import { Injectable } from "@nestjs/common";

@Injectable()
export class PluginExampleService {
	public async exampleMethod(): Promise<{ example: string }> {
		return { example: "example-value" };
	}
}
