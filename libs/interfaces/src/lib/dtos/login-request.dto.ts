import { z } from "zod";

export const LoginRequestValidationSchema = z.object({
	/**
	 * @description The name of the user.
	 */
	email: z.string().email().nonempty(),

	/**
	 * @description The email of the user.
	 */
	password: z.string().nonempty(),

	/**
	 * @description The password of the user.
	 */
	remember_me: z.boolean(),
});
export type LoginRequestDto = z.infer<typeof LoginRequestValidationSchema>;
