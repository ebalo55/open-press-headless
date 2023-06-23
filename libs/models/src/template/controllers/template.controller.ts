import { PublicEndpoint } from "@aetheria/support";
import { MongoIdSchema, validate, validateMany } from "@aetheria/utility";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { z } from "zod";
import { TemplateEntity, TemplateRenderingEntity } from "../entities";
import {
	CreateTemplateDTO,
	CreateTemplateDTOValidationSchema,
	UpdateTemplateDTO,
	UpdateTemplateDTOValidationSchema,
} from "../template.dto";
import { TemplateService } from "../template.service";

@Controller("template")
export class TemplateController {
	constructor(private readonly _template_service: TemplateService) {}

	/**
	 * This method is used to create a new template.
	 * @param {CreateTemplateDTO} template - The template to create.
	 * @returns {Promise<TemplateEntity>} - The created template.
	 */
	@Post()
	async create(@Body() template: CreateTemplateDTO) {
		template = validate<CreateTemplateDTO>(template, CreateTemplateDTOValidationSchema);

		return new TemplateEntity(await this._template_service.create(template));
	}

	/**
	 * This method is used to list all templates.
	 * @returns {Promise<TemplateEntity[]>} - The templates.
	 */
	@Get()
	async list() {
		const documents = await this._template_service.findAll();

		return documents.map((template) => new TemplateEntity(template));
	}

	/**
	 * This method is used to get a template.
	 * @param name - The name of the template to get.
	 * @returns {Promise<TemplateEntity>} - The template.
	 */
	@PublicEndpoint()
	@Get("render/:name")
	async render(@Param("name") name: string) {
		name = validate<string>(name, z.string().nonempty().toLowerCase());

		return new TemplateRenderingEntity(await this._template_service.findByName(name));
	}

	/**
	 * This method is used to update a template.
	 * @param {string} template_id - The id of the template to update.
	 * @param {UpdateTemplateDTO} template - The template to update.
	 * @returns {Promise<TemplateEntity>} - The updated template.
	 */
	@Put(":id")
	async update(@Param("id") template_id: string, @Body() template: UpdateTemplateDTO) {
		[template_id, template] = validateMany<[string, UpdateTemplateDTO]>(
			[template_id, template],
			[MongoIdSchema, UpdateTemplateDTOValidationSchema]
		);

		return new TemplateEntity(await this._template_service.update(template_id, template));
	}

	/**
	 * This method is used to delete a template.
	 * @param {string} template_id - The id of the template to delete.
	 * @returns {Promise<TemplateEntity>} - The deleted template.
	 */
	@Delete(":id")
	async delete(@Param("id") template_id: string) {
		template_id = validate<string>(template_id, MongoIdSchema);

		return new TemplateEntity(await this._template_service.delete(template_id));
	}

	/**
	 * This method is used to get a template.
	 * @param {string} template_id - The id of the template to get.
	 * @returns {Promise<TemplateEntity>} - The template.
	 */
	@Get(":id")
	async get(@Param("id") template_id: string) {
		template_id = validate<string>(template_id, MongoIdSchema);

		return new TemplateEntity(await this._template_service.find(template_id));
	}
}
