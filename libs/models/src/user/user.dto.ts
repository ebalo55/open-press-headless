import { z } from "zod";

export const CreateUserDTOValidationSchema = z.strictObject({
	/**
	 * @description The name of the user.
	 */
	name: z.string().min(3).max(255),

	/**
	 * @description The email of the user.
	 */
	email: z.string().email().nonempty(),

	/**
	 * @description The password of the user.
	 */
	password: z.string().min(12),
});
export type CreateUserDTO = z.infer<typeof CreateUserDTOValidationSchema>;

export const UpdateUserDTOValidationSchema = CreateUserDTOValidationSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTOValidationSchema>;
