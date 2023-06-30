import mongoose from "mongoose";
import { z } from "zod";

export const MongoIdSchema = z.custom<string>(
	(value) => {
		/* istanbul ignore next */
		if (typeof value !== "string") {
			return false;
		}

		return mongoose.Types.ObjectId.isValid(value);
	},
	{
		message: "Invalid identifier.",
	},
	true
);
