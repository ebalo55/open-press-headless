import { Constructor } from "@aetheria/backend-interfaces";
import { BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { validate } from "./validate";

export const validateMany = <
	R,
	T extends z.ZodTypeAny = z.ZodTypeAny,
	E extends Constructor<Error> = Constructor<BadRequestException>
>(
	value: any[],
	schema: T[],
	error: E = BadRequestException as any
): R => {
	if (value.length !== schema.length) {
		if (error instanceof BadRequestException) {
			throw new BadRequestException({
				form_errors: [
					{
						message: "The number of items in the array does not match the number of schemas.",
						code: "invalid_array_length",
					},
				],
				field_errors: [],
			});
		}
		throw new error("The number of items in the array does not match the number of schemas.");
	}

	return schema.map((schema, index) => validate(value[index], schema, error)) as any;
};
