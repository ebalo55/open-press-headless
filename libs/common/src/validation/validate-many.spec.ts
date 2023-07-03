import { BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { validateMany } from "./validate-many";

describe("validateMany", () => {
	it("should fail if the number of schemas and values do not match", () => {
		try {
			validateMany(["sample", 123], [z.string()]);
		} catch (e: any) {
			expect(e).toBeInstanceOf(BadRequestException);
		}
	});

	it("should fail if the number of schemas and values do not match with simple error", () => {
		try {
			validateMany(["sample", 123], [z.string()], Error);
		} catch (e: any) {
			expect(e).toBeInstanceOf(Error);
		}
	});
});
